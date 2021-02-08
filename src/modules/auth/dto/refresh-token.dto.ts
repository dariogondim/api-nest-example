import { ApiModelProperty } from '@nestjs/swagger';

export class RefreshToken {

    @ApiModelProperty()
    refreshToken: string;

    @ApiModelProperty()
    expiresIn: number;
}