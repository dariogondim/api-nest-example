import { Inject, ForbiddenException, Injectable } from '@nestjs/common';

import { Sequelize } from 'sequelize-typescript';

import { Relationship } from './relationship.entity';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { RetrieveRelationshipDto } from './dto/retrieve-relationship.dto';
import { RetrieveRelationshipQuery } from './query/retrieve-relationship.query';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { Message } from '../message/message.entity';
import { Profile } from '../profile/profile.entity';
import { DeleteRelationshipQuery } from './query/delete-relationship.query';
import { BtModel } from '../bt-model/bt-model.entity';
import { FirebaseService } from '../../firebase/firebase.service';
import { NotificationUser } from '../user/notification-user.entity';
import { NotificationType } from '../../../enums/notification-type.enum';

@Injectable()
export class RelationshipService {

    constructor(
        private readonly fbService: FirebaseService,
        @Inject('RelationshipRepository') private readonly relationshipRepository: typeof Relationship,
        @Inject('MessageRepository') private readonly messageRepository: typeof Message,
        @Inject('ProfileRepository') private readonly profileRepository: typeof Profile,
        @Inject('BtModelRepository') private readonly btModelRepository: typeof BtModel,
        @Inject('NotificationUserRepository') private readonly notificationUserRepository: typeof NotificationUser
    ) { }

    async findOne(queryParams: RetrieveRelationshipQuery, userId: number): Promise<RetrieveRelationshipDto> {
        const relationship: Relationship = await this.relationshipRepository.findOne({
            where: {
                [Sequelize.Op.or]: [
                    {[Sequelize.Op.and]: [
                        { userId: userId },
                        { affiliationId: queryParams.affiliationId }
                    ]},
                    {[Sequelize.Op.and]: [
                        { userId: queryParams.affiliationId },
                        { affiliationId: userId }
                    ]}
                ]
            }
        });

        if(!relationship)
            return null;

        return new RetrieveRelationshipDto(relationship);
    }

    async findAllPending(tokenUserId: number): Promise<RetrieveRelationshipDto[]> {
        const relationships: Relationship[] = await this.relationshipRepository.findAll({
            where: { affiliationId: tokenUserId, isActive: false }
        });

        const relationshipsDto: RetrieveRelationshipDto[] = [];

        if(relationships.length > 0 ) {
            for(let relationship of relationships) {
                const profile: Profile = await this.profileRepository.findOne({
                    where: {
                        [Sequelize.Op.or]: [
                            { userId: relationship.userId },
                            { userId: relationship.affiliationId }
                        ],
                        userId: { [Sequelize.Op.ne]: tokenUserId }
                    }
                });
                const btModel: BtModel = await this.btModelRepository.findOne({
                    where: {
                        [Sequelize.Op.or]: [
                            { userId: relationship.userId },
                            { userId: relationship.affiliationId }
                        ],
                        userId: { [Sequelize.Op.ne]: tokenUserId }
                    }
                });
                relationshipsDto.push(new RetrieveRelationshipDto(relationship, profile.name, btModel.id));
            }
        }

        return relationshipsDto;
    }

    async findAllMatch(tokenUserId: number): Promise<RetrieveRelationshipDto[]> {
        const relationships: Relationship[] = await this.relationshipRepository.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { userId: tokenUserId },
                    { affiliationId: tokenUserId }
                ],
                isActive: true
            }
        });

        const relationshipsDto: RetrieveRelationshipDto[] = [];

        for(let relationship of relationships) {
            let profile: Profile = await this.profileRepository.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        { userId: relationship.userId },
                        { userId: relationship.affiliationId }
                    ],
                    userId: { [Sequelize.Op.ne]: tokenUserId }
                }
            });
            let btModel: BtModel = await this.btModelRepository.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        { userId: relationship.userId },
                        { userId: relationship.affiliationId }
                    ],
                    userId: { [Sequelize.Op.ne]: tokenUserId }
                }
            });
            let lastMessage: Message = await this.messageRepository.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        {[Sequelize.Op.and]: [
                            { senderId: relationship.userId },
                            { receiverId: relationship.affiliationId }
                        ]},
                        {[Sequelize.Op.and]: [
                            { senderId: relationship.affiliationId },
                            { receiverId: relationship.userId }
                        ]}
                    ]
                },
                order: [ ['createdAt', 'DESC'] ]
            });
            let messages: Message[] = await this.messageRepository.findAll({
                attributes: [
                    [
                        this.messageRepository.sequelize.fn('COUNT', this.messageRepository.sequelize.col('id')), 'newMessages'
                    ]
                ],
                where: {
                    [Sequelize.Op.or]: [
                        {[Sequelize.Op.and]: [
                            { senderId: relationship.userId },
                            { receiverId: relationship.affiliationId },
                            { senderId: { [Sequelize.Op.ne]: tokenUserId } },
                            { isRead: false }
                        ]},
                        {[Sequelize.Op.and]: [
                            { senderId: relationship.affiliationId },
                            { receiverId: relationship.userId },
                            { senderId: { [Sequelize.Op.ne]: tokenUserId } },
                            { isRead: false }
                        ]}
                    ]
                }
            });
            let newMessages: number = messages[0].get('newMessages');
            relationshipsDto.push(new RetrieveRelationshipDto(relationship, profile.name, btModel.id, lastMessage, newMessages));
        }

        return relationshipsDto;
    }

    async create(relationshipDto: CreateRelationshipDto, tokenPayload: any): Promise<RetrieveRelationshipDto> {
        const relationship: [Relationship, boolean] = await this.relationshipRepository.findOrCreate({
            where: {
                [Sequelize.Op.or]: [
                    {[Sequelize.Op.and]: [
                        { userId: relationshipDto.userId },
                        { affiliationId: relationshipDto.affiliationId }
                    ]},
                    {[Sequelize.Op.and]: [
                        { userId: relationshipDto.affiliationId },
                        { affiliationId: relationshipDto.userId }
                    ]}
                ]
            },
            defaults: relationshipDto
        });

        const notification: NotificationUser = await this.notificationUserRepository.findOne({
            where: { userId: relationshipDto.affiliationId }
        });

        const btModel: BtModel[] = await this.btModelRepository.findAll({
            where: { userId: tokenPayload.userId }
        });

        // See documentation on defining a message payload.
        const messageNotification = {
            data: {
                type: NotificationType.MATCH.toString(),
                userId: relationship[0].userId.toString(),
                btModelId: btModel[0].id.toString(),
                userName: tokenPayload.name.toString()
            },
            /*notification: {
                title: tokenPayload.name,
                body: message.content,
            },*/
            android: {
                priority: 'high',
                notification: {
                    title: 'Business!',
                    body: `${tokenPayload.name} deseja se conectar a você.`,
                    sound: 'default',
                    tag: tokenPayload.mail,
                    click_action: "FCM_PLUGIN_ACTIVITY"
                }
            },
            "apns": {
                "headers": {
                    "apns-priority": "10"
                },
                "payload": {
                    "aps": {
                        "alert": {
                            "title": "Business!",
                            "body": `${tokenPayload.name} deseja se conectar a você.`
                        },
                        "sound": "default",
                        "thread-id": tokenPayload.mail
                    }
                }
            },
            token: notification.token
        };

        // Send a message to the device corresponding to the provided
        // registration token.
        this.fbService.notifications().send(messageNotification).then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.log('Error sending message:', error);
        });

        return new RetrieveRelationshipDto(relationship[0]);
    }

    async update(relationshipDto: UpdateRelationshipDto, tokenPayload: any): Promise<RetrieveRelationshipDto> {
        const tempId: number = relationshipDto.userId;
        relationshipDto.userId = relationshipDto.affiliationId;
        relationshipDto.affiliationId = tempId;
        const relationships: [number, Relationship[]] = await this.relationshipRepository.update(
            relationshipDto,
            {
                where: {
                    [Sequelize.Op.or]: [
                        {[Sequelize.Op.and]: [
                            { userId: relationshipDto.userId },
                            { affiliationId: relationshipDto.affiliationId }
                        ]},
                        {[Sequelize.Op.and]: [
                            { userId: relationshipDto.affiliationId },
                            { affiliationId: relationshipDto.userId }
                        ]}
                    ]
                },
                returning: true
            }
        );

        if(!relationships[1][0]) { throw new ForbiddenException(); }

        const notification: NotificationUser = await this.notificationUserRepository.findOne({
            where: { userId: relationshipDto.userId }
        });

        const btModel: BtModel[] = await this.btModelRepository.findAll({
            where: { userId: tokenPayload.userId }
        });

        // See documentation on defining a message payload.
        const messageNotification = {
            data: {
                type: NotificationType.MATCH.toString(),
                userId: relationships[1][0].userId.toString(),
                btModelId: btModel[0].id.toString(),
                userName: tokenPayload.name.toString()
            },
            /*notification: {
                title: tokenPayload.name,
                body: message.content,
            },*/
            android: {
                priority: 'high',
                notification: {
                    title: 'Business!',
                    body: `Agora você está conectado a ${tokenPayload.name}.`,
                    sound: 'default',
                    tag: tokenPayload.mail,
                    click_action: "FCM_PLUGIN_ACTIVITY"
                }
            },
            "apns": {
                "headers": {
                    "apns-priority": "10"
                },
                "payload": {
                    "aps": {
                        "alert": {
                            "title": "Business!",
                            "body": `Agora você está conectado a ${tokenPayload.name}.`
                        },
                        "sound": "default",
                        "thread-id": tokenPayload.mail
                    }
                }
            },
            token: notification.token
        };

        // Send a message to the device corresponding to the provided
        // registration token.
        this.fbService.notifications().send(messageNotification).then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.log('Error sending message:', error);
        });
        
        return new RetrieveRelationshipDto(relationships[1][0]);
    }

    async delete(userId: number, queryParams: DeleteRelationshipQuery): Promise<number> {
        const deletedRelationships: number = await this.relationshipRepository.destroy({
            where: {
                [Sequelize.Op.or]: [
                    {[Sequelize.Op.and]: [
                        { userId: userId },
                        { affiliationId: queryParams.affiliationId }
                    ]},
                    {[Sequelize.Op.and]: [
                        { userId: queryParams.affiliationId },
                        { affiliationId: userId }
                    ]}
                ]
            }
        });

        if(deletedRelationships <= 0) { throw new ForbiddenException(); }

        return deletedRelationships;
    }
}