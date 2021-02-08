import { ApiModelProperty } from '@nestjs/swagger';

import { Profile } from '../profile.entity';
import { RelationType } from '../../relation-type/relation-type.enum';

export class RetrieveProfileDto {

    constructor(profile: Profile) {
        this.userId = profile.userId;
        this.name = profile.name;
        this.xperMentor = profile.xperMentor;
        this.imgAvatar = profile.imgAvatar;
        this.phone = profile.phone;
        this.country = profile.country;
        this.city = profile.city;
        this.company = profile.company;
        this.relationType = profile.relationType;
        this.linkedinProfile = profile.linkedinProfile;
        this.facebookProfile = profile.facebookProfile;
        this.twitterProfile = profile.twitterProfile;
        this.instagramProfile = profile.instagramProfile;
        this.nearbyRadiusDistance = profile.nearbyRadiusDistance;
    }

    @ApiModelProperty()
    userId: number;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    xperMentor: boolean;

    @ApiModelProperty()
    imgAvatar: string;

    @ApiModelProperty()
    phone: string;

    @ApiModelProperty()
    country: string;

    @ApiModelProperty()
    city: string;

    @ApiModelProperty()
    company: string;

    @ApiModelProperty({
        enum: RelationType,
        example: [
            RelationType.INVESTOR,
            RelationType.EMPLOYEE,
            RelationType.LIBERAL_PROFESSIONAL,
            RelationType.STARTUP_OWNER,
            RelationType.COMPANY_OWNER
        ]
    })
    relationType: RelationType;

    @ApiModelProperty()
    linkedinProfile: string;

    @ApiModelProperty()
    facebookProfile: string;

    @ApiModelProperty()
    twitterProfile: string;

    @ApiModelProperty()
    instagramProfile: string;

    @ApiModelProperty()
    nearbyRadiusDistance: number;
}