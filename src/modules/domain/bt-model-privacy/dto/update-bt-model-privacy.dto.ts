import { ApiModelProperty } from '@nestjs/swagger';

import { IsInt, IsDefined, IsNotEmpty, Allow, IsBoolean } from 'class-validator';

import { NOT_EMPTY } from '../../../../constants/validation-messages.constant';

export class UpdateBtModelPrivacyDto {

    @IsInt()
    @IsDefined()
    @IsNotEmpty()
    userId: number;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    howMuchPublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    whoPublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    howPublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    whatPublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    insightsPublic: boolean;

    // CAMPOS QUE EXISTEM NA TABELA DO BANCO DE DADOS

    valueOfferPublic: boolean;

    problemsOpportunitiesPublic: boolean;

    channelsPublic: boolean;

    journeyPublic: boolean;

    clientsPublic: boolean;

    ecosystemPublic: boolean;

    processesPublic: boolean;

    assetsPublic: boolean;

    revenuePublic: boolean;

    positiveImpactsPublic: boolean;

    costsPublic: boolean;

    negativeExternalitiesPublic: boolean;

    insights: boolean;
}