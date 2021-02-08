import { ApiModelProperty } from '@nestjs/swagger';

import { IsInt, IsDefined, IsNotEmpty, Allow, IsBoolean } from 'class-validator';

import { NOT_EMPTY, NOT_NULL } from '../../../../constants/validation-messages.constant';

export class UpdateUserPrivacyDto {

    @IsInt()
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    userId: number;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    imgAvatarPublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    cityPublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    companyPublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    relationTypePublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    linkedinProfilePublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    facebookProfilePublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    twitterProfilePublic: boolean;

    @ApiModelProperty()
    @Allow()
    @IsBoolean()
    @IsNotEmpty({ message: NOT_EMPTY })
    instagramProfilePublic: boolean;
}