import { ApiModelProperty } from '@nestjs/swagger';

export class AccessToken {

    @ApiModelProperty()
    accessToken: string;

    @ApiModelProperty()
    expiresIn: number;
}