import { ApiModelProperty, ApiImplicitBody } from '@nestjs/swagger';

import { BtModel } from '../../domain/bt-model/bt-model.entity';
import { AccessToken } from './access-token.dto';
import { UserPrivacy } from '../../domain/user-privacy/user-privacy.entity';
import { RetrieveProfileDto } from '../../domain/profile/dto/retrieve-profile.dto';
import { RetrieveUserPrivacyDto } from '../../domain/user-privacy/dto/retrieve-user-privacy.dto';
import { RetrieveBtModelDto } from '../../domain/bt-model/dto/retrieve-bt-model.dto';

export class ResponseTokenDto {

    @ApiModelProperty()
    accessToken: AccessToken;

    /*@ApiModelProperty()
    refreshToken: RefreshToken;*/

    @ApiModelProperty()
    userProfile: RetrieveProfileDto;

    @ApiModelProperty()
    userPrivacy: RetrieveUserPrivacyDto;

    @ApiModelProperty({ isArray: true, type: RetrieveBtModelDto })
    btModels: RetrieveBtModelDto[];
}