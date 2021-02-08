import { ApiModelProperty } from '@nestjs/swagger';

import { IsInt, IsDefined } from 'class-validator';
import { NOT_NULL } from '../../../../constants/validation-messages.constant';

export class CreateIgnoredUserDto {

    @IsInt()
    @IsDefined({ message: NOT_NULL })
    userId: number;

    @IsInt()
    @IsDefined({ message: NOT_NULL })
    @ApiModelProperty()
    ignoredUserId: number;
}