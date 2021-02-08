import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt, IsDefined, IsNotEmpty } from 'class-validator';

import { NOT_EMPTY, NOT_NULL } from '../../../../constants/validation-messages.constant';

export class CreateUpdateLocationDto {

    @IsInt()
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    userId: number;

    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @ApiModelProperty({ required: true })
    latitude: number;

    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @ApiModelProperty({ required: true })
    longitude: number;
}