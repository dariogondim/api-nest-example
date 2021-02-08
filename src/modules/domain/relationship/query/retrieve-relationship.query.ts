import { ApiModelProperty } from '@nestjs/swagger';

import { IsDefined, IsNotEmpty } from 'class-validator';

import { NOT_NULL, NOT_EMPTY } from '../../../../constants/validation-messages.constant';

export class RetrieveRelationshipQuery {

    @ApiModelProperty()
    @IsDefined({ message: NOT_NULL })
    @IsNotEmpty({ message: NOT_EMPTY })
    affiliationId: number;
}