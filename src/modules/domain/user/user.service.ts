import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt-nodejs';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Profile } from '../profile/profile.entity';
import { RequestTokenDto } from '../../auth/dto/request-token.dto';
import { LastLocation } from '../location/last-location.entity';
import { CreateIgnoredUserDto } from './dto/create-ignored-user.dto';
import { IgnoredUser } from './ignored-user.entity';
import { BtModel } from '../bt-model/bt-model.entity';
import { BtModelPrivacy } from '../bt-model-privacy/bt-model-privacy.entity';
import { UserPrivacy } from '../user-privacy/user-privacy.entity';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
import { NotificationUser } from './notification-user.entity';
/*import { RetrieveUserQuery } from './query/retrieve-user.query';
import { RetrieveSearchUserDto } from './dto/retrieve-search-user.dto';*/

@Injectable()
export class UserService {

    constructor(
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('ProfileRepository') private readonly profileRepository: typeof Profile,
        @Inject('LastLocationRepository') private readonly lastLocationRepository: typeof LastLocation,
        @Inject('IgnoredUserRepository') private readonly ignoredUserRepository: typeof IgnoredUser,
        @Inject('BtModelRepository') private readonly btModelRepository: typeof BtModel,
        @Inject('BtModelPrivacyRepository') private readonly btModelPrivacyRepository: typeof BtModelPrivacy,
        @Inject('UserPrivacyRepository') private readonly userPrivacyRepository: typeof UserPrivacy,
        @Inject('NotificationUserRepository') private readonly notificationUserRepository: typeof NotificationUser
    ) { }

    async findByMail(mail: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { mail },
            include: [
                { model: Profile },
                { model: UserPrivacy }
            ]
        });
    }

    /*async findAll(queryParams: RetrieveUserQuery, tokenUserId: number): Promise<RetrieveSearchUserDto[]> {
        // DEFINE O OBJETO COM AS PROPRIEDADES E VALORES DE FILTRO INICIAIS
        const params: any = {
            latitude: 0,
            longitude: 0,
            radius: 999999,
            tokenUserId: tokenUserId
        };

        // CONFIGURA FILTROS DE BUSCA POR LOCALIZAÇÃO
        if(queryParams.latitude && queryParams.longitude) {
            params.latitude = queryParams.latitude;
            params.longitude = queryParams.longitude;
            if(queryParams.radius && queryParams.radius > 0) {
                params.radius = queryParams.radius;
            }
        }

        // CONFIGURA FILTROS DE BUSCA POR TEXTO
        let andFilterBySearchText: string;
        if(queryParams.search && queryParams.search.length > 0) {
            params.keyword = `%${queryParams.search}%`;
            andFilterBySearchText = `
            AND (
                unaccent("profile"."name") ilike unaccent(:keyword) OR
                unaccent("profile"."company") ilike unaccent(:keyword)
            )`;
        }

        // CONFIGURA FILTROS DE BUSCA POR TIPO DE PERFIL
        let andFilterRelationType: string;
        if(queryParams.relationType) {
            params.relationType = `${queryParams.relationType}`;
            andFilterRelationType = `
            AND (
                "profile"."relationType" = :relationType
            )
            `;
        }

        // CONFIGURA FILTROS DE BUSCA POR USUÁRIOS XPERMENTOR
        let andFilterXperMentor: string;
        if(queryParams.isXperMentor) {
            params.isXperMentor = queryParams.isXperMentor;
            andFilterXperMentor = `
            AND (
                "profile"."xperMentor" = :isXperMentor
            )
            `;
        }

        // EXECUTA A BUSCA
        const rawResultQuery: any[] = await this.btModelRepository.sequelize.query(`
            SELECT
                "btModel".*, "nearby"."distance", "profile"."name", "profile"."xperMentor",
                "profile"."company", "profile"."city", "profile"."country", "profile"."relationType",
                "btModelPrivacy".*
            FROM (
                SELECT DISTINCT ON ("userId") "userId",
                    "latitude", "longitude", "createdAt",
                    (6371 * acos(cos(radians(:latitude)) * cos(radians("latitude")) * cos(radians("longitude") - radians(:longitude)) + sin(radians(:latitude)) * sin(radians("latitude")))) AS "distance"
                FROM "lastLocation"
                ORDER BY "userId", "createdAt" DESC
            ) AS "nearby"
            JOIN "btModel" ON "btModel"."userId" = "nearby"."userId"
            JOIN "profile" ON "profile"."userId" = "nearby"."userId"
            JOIN "btModelPrivacy" ON "btModelPrivacy"."btModelId" = "btModel"."id"
            WHERE "btModel"."userId" <> :tokenUserId
            AND "nearby"."userId" NOT IN (
                SELECT "ignoreds"."ignoredUserId"
                FROM "ignoredUser" AS "ignoreds"
                WHERE "ignoreds"."userId" = :tokenUserId
            )
            ${ andFilterBySearchText || '' }
            ${ andFilterRelationType || '' }
            ${ andFilterXperMentor || '' }
            GROUP BY
                "nearby"."userId", "nearby"."distance", "btModel"."id", "profile"."name",
                "profile"."xperMentor", "profile"."company", "profile"."country", "profile"."city",
                "profile"."relationType", "btModelPrivacy"."btModelId"
            HAVING "distance" < :radius
            ORDER BY "distance"
            LIMIT 20;
        `,
        {
            replacements: params,
            type: this.btModelRepository.sequelize.QueryTypes.SELECT
        });

        // TRATA O RESULTADO DA QUERY E PREPARA O RETORNO
        const retrieveSearchUserDto: RetrieveSearchUserDto[] = [];

        for(let raw of rawResultQuery) {

            // NÃO RETORNA O VALOR DA DISTANCIA PARA BUSCA SEM FILTRO DE LOCALIZAÇÃO
            if(!queryParams.latitude || !queryParams.longitude) {
                raw.distance = null;
            }

            // PRIVACIDADE DE PERFIL DO USUÁRIO
            const userPrivacy: UserPrivacy = await this.userPrivacyRepository.findOne({
                where: { userId: raw.userId }
            });
            if(!userPrivacy.cityPublic) raw.city = null;
            if(!userPrivacy.companyPublic) raw.company = null;

            retrieveSearchUserDto.push(
                new RetrieveSearchUserDto(
                    raw.id, raw.userId, raw.name, raw.xperMentor, raw.company, raw.country,
                    raw.city, raw.purpose, raw.valueOffer, raw.problemsOpportunities,
                    raw.channels, raw.journey, raw.clients, raw.ecosystem, raw.processes,
                    raw.assets, raw.revenue, raw.positiveImpacts, raw.costs,
                    raw.negativeExternalities, raw.insights, raw.distance
                )
            );
        }

        return retrieveSearchUserDto;
    }*/

    /*
    *   Apesar dos relacionamentos no BD permitirem um User possuir vários BtModels,
    *   no MVP o User possuirá apenas um BtModel.
    *   Dessa forma o BtModel e o BtModelPrivacy serão criados juntamente com o User
    *   no momento do cadastro.
    */
    async create(userDto: CreateUserDto): Promise<RequestTokenDto> {
        const hashPassword = bcrypt.hashSync(userDto.password);
        const password = userDto.password;
        userDto.password = hashPassword;
        userDto.mail = userDto.mail.toLowerCase();
        return this.userRepository.sequelize.transaction(
            transaction => this.userRepository.create(
                userDto,
                { transaction },
            ).then(
                user => this.profileRepository.create(
                    {
                        name: userDto.name,
                        userId: user.id
                    },
                    { transaction },
                ).then(
                    () => this.btModelRepository.create(
                        {
                            purpose: '',
                            userId: user.id
                        },
                        { transaction }
                    )
                    .then(
                        btModel => this.btModelPrivacyRepository.create(
                            {
                                btModelId: btModel.id,
                                userId: user.id
                            },
                            { transaction }
                        )
                        .then(
                            () => this.userPrivacyRepository.create(
                                {
                                    userId: user.id
                                },
                                { transaction }
                            )
                            .then(
                                () => this.lastLocationRepository.create(
                                    {
                                        userId: user.id,
                                        latitude: 0,
                                        longitude: 0
                                    },
                                    { transaction }
                                )
                                .then(
                                    () =>  {
                                        const storedUser = { mail: user.mail, password };
                                        return storedUser as RequestTokenDto;
                                    }
                                )
                            )
                        )
                    )
                )
            )
        );
    }

    async ignore(ignoredUserDto: CreateIgnoredUserDto) {
        await this.ignoredUserRepository.create(ignoredUserDto);
    }

    async notification(notificationUser: CreateNotificationUserDto) {
        await this.notificationUserRepository.upsert(notificationUser);
    }
}