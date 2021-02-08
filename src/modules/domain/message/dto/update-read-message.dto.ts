import { ApiModelProperty } from '@nestjs/swagger';

import { IsArray, IsDefined, IsNotEmpty } from 'class-validator';

import { NOT_NULL, NOT_EMPTY } from '../../../../constants/validation-messages.constant';

export class UpdateReadMessageDto {

    @ApiModelProperty({
        isArray: true,
        example: [1,3,5]
    })
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @IsArray()
    messageIds: number[];
}