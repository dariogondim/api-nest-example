import { Inject, Injectable } from '@nestjs/common';

import { Sequelize } from 'sequelize-typescript';

import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { RetrieveMessageDto } from './dto/retrieve-message.dto';
import { UpdateReadMessageDto } from './dto/update-read-message.dto';
import { FirebaseService } from '../../firebase/firebase.service';
import { NotificationUser } from '../user/notification-user.entity';
import { NotificationType } from '../../../enums/notification-type.enum';
import { BtModel } from '../bt-model/bt-model.entity';

@Injectable()
export class MessageService {

    constructor(
        private readonly fbService: FirebaseService,
        @Inject('MessageRepository') private readonly messageRepository: typeof Message,
        @Inject('BtModelRepository') private readonly btModelRepository: typeof BtModel,
        @Inject('NotificationUserRepository') private readonly notificationUserRepository: typeof NotificationUser
    ) { }

    async findAllByUser(senderId: number, receiverId: number): Promise<RetrieveMessageDto[]> {
        const messages: Message[] = await this.messageRepository.findAll({
            where: {
                [Sequelize.Op.or]: [
                    {[Sequelize.Op.and]: [
                        { senderId: senderId },
                        { receiverId: receiverId }
                    ]},
                    {[Sequelize.Op.and]: [
                        { senderId: receiverId },
                        { receiverId: senderId }
                    ]}
                ]
            },
            order: [ [ 'createdAt', 'ASC' ] ]
        });

        const retrieveMessagesDto: RetrieveMessageDto[] = [];
        for(let message of messages) {
            retrieveMessagesDto.push(new RetrieveMessageDto(message));
        }

        return retrieveMessagesDto;
    }

    async create(messageDto: CreateMessageDto, tokenPayload: any): Promise<RetrieveMessageDto> {
        const message: Message = await this.messageRepository.create(messageDto);

        const notification: NotificationUser = await this.notificationUserRepository.findOne({
            where: { userId: messageDto.receiverId }
        });

        const btModel: BtModel[] = await this.btModelRepository.findAll({
            where: { userId: tokenPayload.userId }
        });

        // See documentation on defining a message payload.
        const messageNotification = {
            data: {
                type: NotificationType.CHAT.toString(),
                userId: message.senderId.toString(),
                btModelId: btModel[0].id.toString(),
                userName: tokenPayload.name.toString()
            },
            android: {
                priority: 'high',
                notification: {
                    title: tokenPayload.name,
                    body: message.content,
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
                            "title": tokenPayload.name,
                            "body": message.content
                        },
                        "badge": 1,
                        "sound": "default",
                        "thread-id": tokenPayload.mail
                    }
                }
            },
            token: notification.token
        };

        this.fbService.notifications().send(messageNotification).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.log('Error sending message:', error);
        });

        return new RetrieveMessageDto(message);
    }

    async markAsRead(updateReadMessageDto: UpdateReadMessageDto, tokenUserId: number) {
        this.messageRepository.update({ isRead: true }, {
            where: {
                id: { [Sequelize.Op.or]: updateReadMessageDto.messageIds },
                receiverId: tokenUserId
            }
        });
    }
}