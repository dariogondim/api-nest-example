import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Allow, IsArray, IsNumberString, IsDefined } from 'class-validator';

import { RelationType } from './../../relation-type/relation-type.enum';
import { NOT_EMPTY } from './../../../../constants/validation-messages.constant';

export class UpdateProfileDto {

    @IsInt()
    @IsDefined()
    @IsNotEmpty({ message: NOT_EMPTY })
    userId: number;

    @ApiModelProperty({ required: true })
    @IsNotEmpty({ message: NOT_EMPTY })
    name: string;

    @ApiModelProperty()
    @Allow()
    imgAvatar: string;

    @ApiModelProperty()
    @Allow()
    @IsNumberString()
    phone: string;

    @ApiModelProperty()
    @Allow()
    country: string;

    @ApiModelProperty()
    @Allow()
    city: string;

    @ApiModelProperty()
    @Allow()
    company: string;

    @ApiModelProperty({
        enum: RelationType,
        type: RelationType,
        example: [
            RelationType.INVESTOR,
            RelationType.EMPLOYEE,
            RelationType.LIBERAL_PROFESSIONAL,
            RelationType.STARTUP_OWNER,
            RelationType.COMPANY_OWNER
        ]
    })
    @Allow()
    relationType: RelationType;

    @ApiModelProperty()
    @Allow()
    linkedinProfile: string;

    @ApiModelProperty()
    @Allow()
    facebookProfile: string;

    @ApiModelProperty()
    @Allow()
    twitterProfile: string;

    @ApiModelProperty()
    @Allow()
    instagramProfile: string;

    @ApiModelProperty()
    @Allow()
    nearbyRadiusDistance: number;
}