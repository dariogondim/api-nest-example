import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

import { BtModel } from '../bt-model.entity';
import { RetrieveBtModelPrivacyDto } from '../../bt-model-privacy/dto/retrieve-bt-model-privacy';
import { RetrieveProfileDto } from '../../profile/dto/retrieve-profile.dto';

export class RetrieveBtModelDto {

    constructor(btModel: BtModel) {
        this.id = btModel.id;
        this.userId = btModel.userId;
        this.purpose = btModel.purpose;
        this.valueOffer = btModel.valueOffer;
        this.problemsOpportunities = btModel.problemsOpportunities;
        this.channels = btModel.channels;
        this.journey = btModel.journey;
        this.clients = btModel.clients;
        this.ecosystem = btModel.ecosystem;
        this.processes = btModel.processes;
        this.assets = btModel.assets;
        this.revenue = btModel.revenue;
        this.positiveImpacts = btModel.positiveImpacts;
        this.costs = btModel.costs;
        this.negativeExternalities = btModel.negativeExternalities;
        this.insights = btModel.insights;
    }

    @ApiModelProperty()
    id: number;
    
    @ApiModelProperty()
    userId: number;

    @ApiModelProperty()
    purpose: string;

    @ApiModelProperty()
    valueOffer: string;

    @ApiModelProperty()
    problemsOpportunities: string;

    @ApiModelProperty()
    channels: string;

    @ApiModelProperty()
    journey: string;

    @ApiModelProperty()
    clients: string;

    @ApiModelProperty()
    ecosystem: string;

    @ApiModelProperty()
    processes: string;

    @ApiModelProperty()
    assets: string;

    @ApiModelProperty()
    revenue: string;

    @ApiModelProperty()
    positiveImpacts: string;

    @ApiModelProperty()
    costs: string;

    @ApiModelProperty()
    negativeExternalities: string;

    @ApiModelProperty()
    insights: string;

    @ApiModelPropertyOptional()
    privacy: RetrieveBtModelPrivacyDto;

    @ApiModelPropertyOptional()
    userProfile?: RetrieveProfileDto;
}