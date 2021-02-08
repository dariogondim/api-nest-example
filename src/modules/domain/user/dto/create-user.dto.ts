import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, MinLength, IsNotEmpty, IsDefined } from 'class-validator';

import {
    NOT_EMPTY, PASSWORD_MIN_LENGTH, NOT_NULL, MAIL_MUST_BE_VALID,
} from '../../../../constants/validation-messages.constant';

export class CreateUserDto {

    @IsNotEmpty({ message: NOT_EMPTY })
    @IsDefined({ message: NOT_NULL })
    @ApiModelProperty({ required: true })
    name: string;

    @IsEmail({}, { message: MAIL_MUST_BE_VALID })
    @IsNotEmpty({ message: NOT_EMPTY })
    @IsDefined({ message: NOT_NULL })
    @ApiModelProperty({ required: true })
    mail: string;

    @MinLength(6, { message: PASSWORD_MIN_LENGTH })
    @IsNotEmpty({ message: NOT_EMPTY })
    @IsDefined({ message: NOT_NULL })
    @ApiModelProperty({ required: true })
    password: string;
}