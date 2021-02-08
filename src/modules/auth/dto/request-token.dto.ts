import { ApiModelProperty } from '@nestjs/swagger';

import { Allow, IsDefined, IsNotEmpty, IsEmail } from 'class-validator';

import { NOT_EMPTY, NOT_NULL } from '../../../constants/validation-messages.constant';

export class RequestTokenDto {
    
    @ApiModelProperty({ required: true })
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    @IsEmail()
    mail: string;

    @ApiModelProperty({ required: true })
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    password: string;
}