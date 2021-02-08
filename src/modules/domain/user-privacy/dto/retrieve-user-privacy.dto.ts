import { ApiModelProperty } from '@nestjs/swagger';

import { UserPrivacy } from '../user-privacy.entity';

export class RetrieveUserPrivacyDto {

    constructor(userPrivacy: UserPrivacy) {
        this.userId = userPrivacy.userId;
        this.imgAvatarPublic = userPrivacy.imgAvatarPublic;
        this.cityPublic = userPrivacy.cityPublic;
        this.companyPublic = userPrivacy.companyPublic;
        this.relationTypePublic = userPrivacy.relationTypePublic;
        this.linkedinProfilePublic = userPrivacy.linkedinProfilePublic;
        this.facebookProfilePublic = userPrivacy.facebookProfilePublic;
        this.twitterProfilePublic = userPrivacy.twitterProfilePublic;
        this.instagramProfilePublic = userPrivacy.instagramProfilePublic;
    }

    @ApiModelProperty()
    userId: number;

    @ApiModelProperty()
    imgAvatarPublic: boolean;

    @ApiModelProperty()
    cityPublic: boolean;

    @ApiModelProperty()
    companyPublic: boolean;

    @ApiModelProperty()
    relationTypePublic: boolean;

    @ApiModelProperty()
    linkedinProfilePublic: boolean;

    @ApiModelProperty()
    facebookProfilePublic: boolean;

    @ApiModelProperty()
    twitterProfilePublic: boolean;

    @ApiModelProperty()
    instagramProfilePublic: boolean;
}