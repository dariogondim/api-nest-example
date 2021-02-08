import { IsDefined, IsNotEmpty, IsInt } from 'class-validator';

import { NOT_NULL, NOT_EMPTY } from '../../../../constants/validation-messages.constant';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateMessageDto {

    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    senderId: number;

    @IsInt()
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @ApiModelProperty()
    receiverId: number;

    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @ApiModelProperty()
    content: string;
}