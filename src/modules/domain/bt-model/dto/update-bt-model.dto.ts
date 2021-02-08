import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Allow, IsDefined } from 'class-validator';

import { NOT_EMPTY } from './../../../../constants/validation-messages.constant';

export class UpdateBtModelDto {

    @IsInt()
    @IsDefined()
    @IsNotEmpty({ message: NOT_EMPTY })
    userId: number;

    @ApiModelProperty()
    @Allow()
    @IsNotEmpty({ message: NOT_EMPTY })
    purpose: string;

    @ApiModelProperty()
    @Allow()
    @IsNotEmpty({ message: NOT_EMPTY })
    valueOffer: string;

    @ApiModelProperty()
    @Allow()
    @IsNotEmpty({ message: NOT_EMPTY })
    problemsOpportunities: string;

    @ApiModelProperty()
    @Allow()
    channels: string;

    @ApiModelProperty()
    @Allow()
    journey: string;

    @ApiModelProperty()
    @Allow()
    clients: string;

    @ApiModelProperty()
    @Allow()
    ecosystem: string;

    @ApiModelProperty()
    @Allow()
    processes: string;

    @ApiModelProperty()
    @Allow()
    assets: string;

    @ApiModelProperty()
    @Allow()
    revenue: string;

    @ApiModelProperty()
    @Allow()
    positiveImpacts: string;

    @ApiModelProperty()
    @Allow()
    costs: string;

    @ApiModelProperty()
    @Allow()
    negativeExternalities: string;

    @ApiModelProperty()
    @Allow()
    insights: string;
}