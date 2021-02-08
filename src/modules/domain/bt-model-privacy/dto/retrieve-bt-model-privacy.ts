import { ApiModelProperty } from '@nestjs/swagger';
import { BtModelPrivacy } from '../bt-model-privacy.entity';

export class RetrieveBtModelPrivacyDto {

    constructor(btModelPrivacy: BtModelPrivacy) {
        if(btModelPrivacy.problemsOpportunitiesPublic) {
            this.whatPublic = true;
        } else {
            this.whatPublic = false;
        }
        if(btModelPrivacy.channelsPublic) {
            this.whoPublic = true;
        } else {
            this.whoPublic = false;
        }
        if(btModelPrivacy.ecosystemPublic) {
            this.howPublic = true;
        } else {
            this.howPublic = false;
        }
        if(btModelPrivacy.revenuePublic) {
            this.howMuchPublic = true;
        } else {
            this.howMuchPublic = false;
        }
        if(btModelPrivacy.insightsPublic) {
            this.insightsPublic = true
        } else {
            this.insightsPublic = false
        }
    }

    @ApiModelProperty()
    userId: number;

    @ApiModelProperty()
    btModelId: number;

    @ApiModelProperty()
    howMuchPublic: boolean;

    @ApiModelProperty()
    whoPublic: boolean;

    @ApiModelProperty()
    howPublic: boolean;

    @ApiModelProperty()
    whatPublic: boolean;

    @ApiModelProperty()
    insightsPublic: boolean;
}