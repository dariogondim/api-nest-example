import { Inject, ForbiddenException, Injectable } from '@nestjs/common';

import { BtModelPrivacy } from './bt-model-privacy.entity';
import { BtModel } from '../bt-model/bt-model.entity';
import { UpdateBtModelPrivacyDto } from './dto/update-bt-model-privacy.dto';
import { RetrieveBtModelPrivacyDto } from './dto/retrieve-bt-model-privacy';
import { RetrieveBtModelDto } from '../bt-model/dto/retrieve-bt-model.dto';

@Injectable()
export class BtModelPrivacyService {

    constructor(
        @Inject('BtModelPrivacyRepository') private readonly btModelPrivacyRepository: typeof BtModelPrivacy,
        @Inject('BtModelRepository') private readonly btModelRepository: typeof BtModel
    ) { }

    async findOne(btModelId: number, userId: number): Promise<RetrieveBtModelPrivacyDto> {
        const btModelPrivacy: BtModelPrivacy = await this.btModelPrivacyRepository.findOne({
            where: { btModelId, userId }
        });

        if(!btModelPrivacy)
            throw new ForbiddenException();
        
        const btModelPrivacyDto: RetrieveBtModelPrivacyDto = new RetrieveBtModelPrivacyDto(btModelPrivacy);
        
        btModelPrivacyDto.userId = btModelPrivacy.userId;
        btModelPrivacyDto.btModelId = btModelPrivacy.btModelId;
        
        return btModelPrivacyDto;
    }

    async update(btModelId: number, btModelPrivacyDto: UpdateBtModelPrivacyDto): Promise<RetrieveBtModelDto> {
        // WHAT (O QUE?)
        if(btModelPrivacyDto.whatPublic != undefined) {
            btModelPrivacyDto.valueOfferPublic = btModelPrivacyDto.whatPublic;
            btModelPrivacyDto.problemsOpportunitiesPublic = btModelPrivacyDto.whatPublic; 
        } else {
            delete btModelPrivacyDto.valueOfferPublic;
            delete btModelPrivacyDto.problemsOpportunitiesPublic;
        }
        // WHO (QUEM?)
        if(btModelPrivacyDto.whoPublic != undefined) {
            btModelPrivacyDto.channelsPublic = btModelPrivacyDto.whoPublic;
            btModelPrivacyDto.journeyPublic = btModelPrivacyDto.whoPublic;
            btModelPrivacyDto.clientsPublic = btModelPrivacyDto.whoPublic;
        } else {
            delete btModelPrivacyDto.channelsPublic;
            delete btModelPrivacyDto.journeyPublic;
            delete btModelPrivacyDto.clientsPublic;
        }
        // HOW (COMO?)
        if(btModelPrivacyDto.howPublic != undefined) {
            btModelPrivacyDto.ecosystemPublic = btModelPrivacyDto.howPublic;
            btModelPrivacyDto.processesPublic = btModelPrivacyDto.howPublic;
            btModelPrivacyDto.assetsPublic = btModelPrivacyDto.howPublic;
        } else {
            delete btModelPrivacyDto.ecosystemPublic;
            delete btModelPrivacyDto.processesPublic;
            delete btModelPrivacyDto.assetsPublic;
        }
        // HOWMUCH (QUANTO?)
        if(btModelPrivacyDto.howMuchPublic != undefined) {
            btModelPrivacyDto.revenuePublic = btModelPrivacyDto.howMuchPublic;
            btModelPrivacyDto.positiveImpactsPublic = btModelPrivacyDto.howMuchPublic;
            btModelPrivacyDto.costsPublic = btModelPrivacyDto.howMuchPublic;
            btModelPrivacyDto.negativeExternalitiesPublic = btModelPrivacyDto.howMuchPublic;
        } else {
            delete btModelPrivacyDto.revenuePublic;
            delete btModelPrivacyDto.positiveImpactsPublic;
            delete btModelPrivacyDto.costsPublic;
            delete btModelPrivacyDto.negativeExternalitiesPublic;
        }
        if(btModelPrivacyDto.insightsPublic != undefined) {
            btModelPrivacyDto.insightsPublic = btModelPrivacyDto.insightsPublic;
        } else {
            delete btModelPrivacyDto.insightsPublic;
        }

        const btModelPrivacy: [number, BtModelPrivacy[]] = await this.btModelPrivacyRepository.update(
            btModelPrivacyDto,
            {
                where: {
                    btModelId: btModelId,
                    userId: btModelPrivacyDto.userId
                },
                returning: true
            }
        );

        if(!btModelPrivacy[1][0])
            throw new ForbiddenException();

        const retrieveBtModelPrivacyDto: RetrieveBtModelPrivacyDto = new RetrieveBtModelPrivacyDto(btModelPrivacy[1][0]);
        retrieveBtModelPrivacyDto.userId = btModelPrivacy[1][0].userId;
        retrieveBtModelPrivacyDto.btModelId = btModelPrivacy[1][0].btModelId;

        const btModel: BtModel = await this.btModelRepository.findOne({
            where: { id: btModelId, userId: btModelPrivacyDto.userId }
        })

        const retrieveBtModelDto: RetrieveBtModelDto = new RetrieveBtModelDto(btModel);
        retrieveBtModelDto.privacy = retrieveBtModelPrivacyDto;

        return retrieveBtModelDto;
    }
}