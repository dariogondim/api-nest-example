import { ApiModelProperty } from '@nestjs/swagger';

export class BtModelSearchComponentsDto {

    @ApiModelProperty()
    purpose: boolean = false;

    @ApiModelProperty()
    valueOffer: boolean = false;

    @ApiModelProperty()
    problemsOpportunities: boolean = false;

    @ApiModelProperty()
    channels: boolean = false;

    @ApiModelProperty()
    journey: boolean = false;

    @ApiModelProperty()
    clients: boolean = false;

    @ApiModelProperty()
    ecosystem: boolean = false;

    @ApiModelProperty()
    processes: boolean = false;

    @ApiModelProperty()
    assets: boolean = false;

    @ApiModelProperty()
    revenue: boolean = false;

    @ApiModelProperty()
    positiveImpacts: boolean = false;

    @ApiModelProperty()
    costs: boolean = false;

    @ApiModelProperty()
    negativeExternalities: boolean = false;

    @ApiModelProperty()
    insights: boolean = false;
}