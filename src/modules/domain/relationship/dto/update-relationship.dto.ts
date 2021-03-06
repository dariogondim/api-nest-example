import { ApiModelProperty } from '@nestjs/swagger';

import { IsInt, IsDefined, IsNotEmpty, IsBoolean } from 'class-validator';

import { NOT_NULL, NOT_EMPTY } from '../../../../constants/validation-messages.constant';

export class UpdateRelationshipDto {

    @IsInt()
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    userId: number;

    @IsInt()
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @ApiModelProperty()
    affiliationId: number;

    @IsBoolean()
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @ApiModelProperty()
    isActive: boolean;
}