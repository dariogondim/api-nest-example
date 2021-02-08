import { Inject, ForbiddenException, Injectable } from '@nestjs/common';

import { BtModel } from './bt-model.entity';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';
import { UserPrivacy } from '../user-privacy/user-privacy.entity';
import { BtModelPrivacy } from '../bt-model-privacy/bt-model-privacy.entity';
import { UpdateBtModelDto } from './dto/update-bt-model.dto';
import { RetrieveBtModelDto } from './dto/retrieve-bt-model.dto';
import { RetrieveBtModelPrivacyDto } from '../bt-model-privacy/dto/retrieve-bt-model-privacy';
import { RetrieveProfileDto } from '../profile/dto/retrieve-profile.dto';
import { RetrieveSearchBtModelDto } from './dto/retrieve-search-bt-model.dto';
import { RetrieveBtModelQuery } from './query/retrieve-bt-model.query';
import { BtModelSearchComponentsDto } from './dto/bt-model-search-components.dto';
import { UtilService } from '../../util/util.service';

@Injectable()
export class BtModelService {

    constructor(
        @Inject('BtModelRepository') private readonly btModelRepository: typeof BtModel,
        @Inject('BtModelPrivacyRepository') private readonly btModelPrivacyRepository: typeof BtModelPrivacy,
        @Inject('UserPrivacyRepository') private readonly userPrivacyRepository: typeof UserPrivacy,
        private readonly utilService: UtilService
    ) { }

    async findOne(btModelId: number): Promise<RetrieveBtModelDto> {
        const btModel: BtModel = await this.btModelRepository.findOne({
            where: { id: btModelId },
            include: [
                { model: BtModelPrivacy },
                { model: User, include: [
                    { model: Profile },
                    { model: UserPrivacy }
                ]}
            ]
        });
        if(!btModel.user.privacy.cityPublic) btModel.user.profile.city = null;
        if(!btModel.user.privacy.companyPublic) btModel.user.profile.company = null;
        if(!btModel.user.privacy.linkedinProfilePublic) btModel.user.profile.linkedinProfile = null;
        if(!btModel.user.privacy.facebookProfilePublic) btModel.user.profile.facebookProfile = null;
        if(!btModel.user.privacy.twitterProfilePublic) btModel.user.profile.twitterProfile = null;
        if(!btModel.user.privacy.instagramProfilePublic) btModel.user.profile.instagramProfile = null;

        if(!btModel.privacy.valueOfferPublic) btModel.valueOffer = null;
        if(!btModel.privacy.problemsOpportunitiesPublic) btModel.problemsOpportunities = null;
        if(!btModel.privacy.channelsPublic) btModel.channels = null;
        if(!btModel.privacy.journeyPublic) btModel.journey = null;
        if(!btModel.privacy.clientsPublic) btModel.clients = null;
        if(!btModel.privacy.ecosystemPublic) btModel.ecosystem = null;
        if(!btModel.privacy.processesPublic) btModel.processes = null;
        if(!btModel.privacy.assetsPublic) btModel.assets = null;
        if(!btModel.privacy.revenuePublic) btModel.revenue = null;
        if(!btModel.privacy.positiveImpactsPublic) btModel.positiveImpacts = null;
        if(!btModel.privacy.costsPublic) btModel.costs = null;
        if(!btModel.privacy.negativeExternalitiesPublic) btModel.negativeExternalities = null;
        if(!btModel.privacy.insightsPublic) btModel.insights = null;
        
        const retrieveBtModelDto: RetrieveBtModelDto = new RetrieveBtModelDto(btModel);
        retrieveBtModelDto.userProfile = new RetrieveProfileDto(btModel.user.profile);
        retrieveBtModelDto.privacy = new RetrieveBtModelPrivacyDto(btModel.privacy);
        
        return retrieveBtModelDto;
    }

    async update(id: number, btModelDto: UpdateBtModelDto): Promise<RetrieveBtModelDto> {
        const btModel: [number, BtModel[]] = await this.btModelRepository.update(
            btModelDto,
            {
                where: { id: id, userId: btModelDto.userId },
                returning: true
            }
        );

        if(!btModel[1][0])
            throw new ForbiddenException();

        return new RetrieveBtModelDto(btModel[1][0]);
    }

    /*
    * Encontra os 20 modelos de negócio mais proximos da localizaçao(lat, lng) informada,
    * restritos pelo raio de alcance informado.
    * Adaptado de: https://developers.google.com/maps/solutions/store-locator/clothing-store-locator
    */

   async findAll(queryParams: RetrieveBtModelQuery, tokenUserId: number): Promise<RetrieveSearchBtModelDto[]> {

        // DEFINE O OBJETO COM OS ATRIBUTOS E VALORES INICIAIS DE FILTRO
        const params: any = {
            latitude: 0,
            longitude: 0,
            radius: 999999,
            tokenUserId: tokenUserId
        };

        // CONFIGURA FILTROS DE BUSCA POR LOCALIZAÇÃO
        // let interval: string = `'100 year'`;
        if(queryParams.latitude && queryParams.longitude) {
            params.latitude = queryParams.latitude;
            params.longitude = queryParams.longitude;
            if(queryParams.radius && queryParams.radius > 0) {
                params.radius = queryParams.radius;
            }
            if(!queryParams.search && !queryParams.radius) {
                params.radius = 5;
                // interval = `'1 day'`;
            }
        }

        // CONFIGURA FILTROS DE BUSCA POR TEXTO NO PROFILE E COMPONENTES DE NEGÓCIO 
        let andFilterBySearchText: string;
        if(queryParams.search && queryParams.search.length > 0) {
            params.keyword = `%${queryParams.search}%`;

            andFilterBySearchText = `AND (`;
            let filtersCount = 0;
            if(queryParams.byName) {
                andFilterBySearchText += `unaccent("profile"."name") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byCompany) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("profile"."company") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byPurpose) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."purpose") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byValueOffer) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."valueOffer") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byProblemsOpportunities) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."problemsOpportunities") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byChannels) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."channels") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byJourney) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."journey") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byClients) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."clients") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byEcosystem) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."ecosystem") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byProcesses) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."processes") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byAssets) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."assets") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byRevenue) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."revenue") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byPositiveImpacts) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."positiveImpacts") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byCosts) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."costs") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byNegativeExternalities) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."negativeExternalities") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            if(queryParams.byInsights) {
                if(filtersCount > 0) { andFilterBySearchText += ` OR `; }
                andFilterBySearchText += `unaccent("btModel"."insights") ilike unaccent(:keyword)`;
                filtersCount++;
            }
            andFilterBySearchText += `)`;

            // Se nenhum filtro foi adicionado, então busca em todos os campos
            if(filtersCount == 0) {
                andFilterBySearchText = null;
                andFilterBySearchText = `
                AND (
                    unaccent("profile"."name") ilike unaccent(:keyword) OR
                    unaccent("profile"."company") ilike unaccent(:keyword) OR
                    unaccent("btModel"."purpose") ilike unaccent(:keyword) OR
                    unaccent("btModel"."valueOffer") ilike unaccent(:keyword) OR
                    unaccent("btModel"."problemsOpportunities") ilike unaccent(:keyword) OR
                    unaccent("btModel"."channels") ilike unaccent(:keyword) OR
                    unaccent("btModel"."journey") ilike unaccent(:keyword) OR
                    unaccent("btModel"."clients") ilike unaccent(:keyword) OR
                    unaccent("btModel"."ecosystem") ilike unaccent(:keyword) OR
                    unaccent("btModel"."processes") ilike unaccent(:keyword) OR
                    unaccent("btModel"."assets") ilike unaccent(:keyword) OR
                    unaccent("btModel"."revenue") ilike unaccent(:keyword) OR
                    unaccent("btModel"."positiveImpacts") ilike unaccent(:keyword) OR
                    unaccent("btModel"."costs") ilike unaccent(:keyword) OR
                    unaccent("btModel"."negativeExternalities") ilike unaccent(:keyword) OR
                    unaccent("btModel"."insights") ilike unaccent(:keyword)
                )`;
            }
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
        // Removida restrição de horário para modelos encontrados próximos.
        // WHERE "updatedAt" > (CURRENT_TIMESTAMP - INTERVAL ${ interval })
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
                ORDER BY "userId", "updatedAt" DESC
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
            LIMIT 50;
        `,
        {
            replacements: params,
            type: this.btModelRepository.sequelize.QueryTypes.SELECT
        });

        // TRATA O RESULTADO DA QUERY E PREPARA O RETORNO
        const retrieveSearchBtModelsDto: RetrieveSearchBtModelDto[] = [];

        for(let raw of rawResultQuery) {

            // NÃO RETORNA O VALOR DA DISTANCIA PARA BUSCA COM LOCALIZAÇÃO "IGNORADA"
            if(!queryParams.latitude || !queryParams.longitude) {
                raw.distance = null;
            }

            // PRIVACIDADE DE PERFIL DO USUÁRIO
            const userPrivacy: UserPrivacy = await this.userPrivacyRepository.findOne({
                where: { userId: raw.userId }
            });
            if(!userPrivacy.cityPublic) raw.city = null;
            if(!userPrivacy.companyPublic) raw.company = null;

            // FOUND COMPONENTS
            let foundComponents: BtModelSearchComponentsDto = new BtModelSearchComponentsDto();
            if(queryParams.search) {
                const keyword = new RegExp(this.utilService.accentFold(queryParams.search), "i");
                if(raw.purpose && this.utilService.accentFold(raw.purpose).search(keyword) > -1)
                    foundComponents.purpose = true;
                if(raw.valueOffer && this.utilService.accentFold(raw.valueOffer).search(keyword) > -1)
                    foundComponents.valueOffer = true;
                if(raw.problemsOpportunities && this.utilService.accentFold(raw.problemsOpportunities).search(keyword) > -1)
                    foundComponents.problemsOpportunities = true;
                if(raw.channels && this.utilService.accentFold(raw.channels).search(keyword) > -1)
                    foundComponents.channels = true;
                if(raw.journey && this.utilService.accentFold(raw.journey).search(keyword) > -1)
                    foundComponents.journey = true;
                if(raw.clients && this.utilService.accentFold(raw.clients).search(keyword) > -1)
                    foundComponents.clients = true;
                if(raw.ecosystem && this.utilService.accentFold(raw.ecosystem).search(keyword) > -1)
                    foundComponents.ecosystem = true;
                if(raw.processes && this.utilService.accentFold(raw.processes).search(keyword) > -1)
                    foundComponents.processes = true;
                if(raw.assets && this.utilService.accentFold(raw.assets).search(keyword) > -1)
                    foundComponents.assets = true;
                if(raw.revenue && this.utilService.accentFold(raw.revenue).search(keyword) > -1)
                    foundComponents.revenue = true;
                if(raw.positiveImpacts && this.utilService.accentFold(raw.positiveImpacts).search(keyword) > -1)
                    foundComponents.positiveImpacts = true;
                if(raw.costs && this.utilService.accentFold(raw.costs).search(keyword) > -1)
                    foundComponents.costs = true;
                if(raw.negativeExternalities && this.utilService.accentFold(raw.negativeExternalities).search(keyword) > -1)
                    foundComponents.negativeExternalities = true;
                if(raw.insights && this.utilService.accentFold(raw.insights).search(keyword) > -1)
                    foundComponents.insights = true;
            }

            retrieveSearchBtModelsDto.push(
                new RetrieveSearchBtModelDto(
                    raw.id, raw.userId, raw.name, raw.relationType, raw.xperMentor, raw.company, raw.country,
                    raw.city, raw.purpose, raw.valueOffer, raw.problemsOpportunities,
                    raw.channels, raw.journey, raw.clients, raw.ecosystem, raw.processes,
                    raw.assets, raw.revenue, raw.positiveImpacts, raw.costs, raw.negativeExternalities,
                    raw.insights, raw.distance, foundComponents
                )
            );
        }

        return retrieveSearchBtModelsDto;
    }

    /*
    *   DEPRECATED
    */
    /*async findNearbyModels(queryParams: RetrieveBtModelQuery, tokenUserId: number): Promise<RetrieveSearchBtModelDto[]> {
        if(queryParams.radius < 0 || queryParams.radius == undefined || queryParams.radius == null)
            queryParams.radius = 5;

        const nearbyBtModels: RetrieveNearbyBtModelDto[] = await this.btModelRepository.sequelize.query(`
            SELECT "btModel".*, "nearby"."distance", "profile"."name", "profile"."xperMentor", "profile"."company", "profile"."city", "profile"."country" FROM(
                SELECT DISTINCT ON ("userId") "userId", "latitude", "longitude", "createdAt", (6371 * acos(cos(radians(:latitude)) * cos(radians("latitude")) * cos(radians("longitude") - radians(:longitude)) + sin(radians(:latitude)) * sin(radians("latitude")))) AS "distance"
                FROM "lastLocation"
                WHERE "createdAt" > (CURRENT_TIMESTAMP - INTERVAL '1 day')
                ORDER BY "userId", "createdAt" DESC
            ) AS "nearby"
            JOIN "btModel"
            ON "btModel"."userId" = "nearby"."userId"
            JOIN "profile"
            ON "profile"."userId" = "nearby"."userId"
            WHERE "nearby"."userId" NOT IN (
                SELECT "ignoreds"."ignoredUserId"
                FROM "ignoredUser" AS "ignoreds"
                WHERE "ignoreds"."userId" = :tokenUserId
            )
            AND "btModel"."userId" <> :tokenUserId
            GROUP BY "nearby"."userId", "nearby"."distance", "btModel"."id", "profile"."name", "profile"."xperMentor", "profile"."company", "profile"."country", "profile"."city"
            HAVING "distance" < :radius
            ORDER BY "distance"
            LIMIT 20;
        `,
        {
            replacements: {
                latitude: queryParams.latitude,
                longitude: queryParams.longitude,
                radius: queryParams.radius,
                tokenUserId: tokenUserId
            },
            type: this.btModelRepository.sequelize.QueryTypes.SELECT,
        });

        const retrieveSearchBtModels: RetrieveSearchBtModelDto[] = [];

        for(let nearbyBtModel of nearbyBtModels) {
            const userPrivacy = await this.userPrivacyRepository.findOne({
                where: { userId: nearbyBtModel.userId }
            });
            if(!userPrivacy.cityPublic) nearbyBtModel.city = null;
            if(!userPrivacy.companyPublic) nearbyBtModel.company = null;
            retrieveSearchBtModels.push(
                new RetrieveSearchBtModelDto(
                    nearbyBtModel.id, nearbyBtModel.userId, nearbyBtModel.name,
                    nearbyBtModel.xperMentor, nearbyBtModel.company, nearbyBtModel.country,
                    nearbyBtModel.city, nearbyBtModel.purpose,
                    nearbyBtModel.valueOffer, nearbyBtModel.problemsOpportunities,
                    nearbyBtModel.channels, nearbyBtModel.journey, nearbyBtModel.clients,
                    nearbyBtModel.ecosystem, nearbyBtModel.processes, nearbyBtModel.assets,
                    nearbyBtModel.revenue, nearbyBtModel.positiveImpacts,
                    nearbyBtModel.costs, nearbyBtModel.negativeExternalities,
                    nearbyBtModel.insights, nearbyBtModel.distance
                )
            );
        }
        return retrieveSearchBtModels;
    }*/

    /*async findAllByText(queryParams: RetrieveSearchBtModelQuery, userId: number): Promise<RetrieveSearchBtModelDto[]> {
        const btModels: BtModel[] = await this.btModelRepository.findAll({
            include: [
                {
                    model: User, include: [
                        { model: Profile },
                        { model: UserPrivacy }
                    ]
                },
            ],
            where: {
                [Sequelize.Op.or]: [
                    { '$user.profile.name$': { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { '$user.profile.company$': { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { purpose: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { valueOffer: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { problemsOpportunities: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { channels: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { journey: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { clients: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { ecosystem: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { processes: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { assets: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { revenue: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { positiveImpacts: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { costs: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { negativeExternalities: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } },
                    { insights: { [Sequelize.Op.iLike]: `%${queryParams.search}%` } }
                ],
                userId: { [Sequelize.Op.ne]: userId }
            }
        });

        const retrieveSearchBtModelsDto: RetrieveSearchBtModelDto[] = [];
        for(let btModel of btModels) {
            if(!btModel.user.privacy.companyPublic) btModel.user.profile.company = null;
            if(!btModel.user.privacy.cityPublic) btModel.user.profile.city = null;

            let retrieveSearchBtModelDto: RetrieveSearchBtModelDto = new RetrieveSearchBtModelDto(
                btModel.id, btModel.userId, btModel.user.profile.name, btModel.user.profile.xperMentor,
                btModel.user.profile.company, btModel.user.profile.country, btModel.user.profile.city,
                btModel.purpose, btModel.valueOffer, btModel.problemsOpportunities, btModel.channels,
                btModel.journey, btModel.clients, btModel.ecosystem, btModel.processes, btModel.assets,
                btModel.revenue, btModel.positiveImpacts, btModel.costs, btModel.negativeExternalities
            );
            retrieveSearchBtModelsDto.push(retrieveSearchBtModelDto);
        }

        return retrieveSearchBtModelsDto;
    }*/
}