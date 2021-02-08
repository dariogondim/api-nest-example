import { ApiModelProperty } from '@nestjs/swagger';

import { LastLocation } from '../last-location.entity';

export class RetrieveLocationDto {

    constructor(lastLocation: LastLocation) {
        this.userId = lastLocation.userId;
        this.latitude = lastLocation.latitude;
        this.longitude = lastLocation.longitude;
    }
    
    @ApiModelProperty()
    userId: number;

    @ApiModelProperty()
    latitude: number;

    @ApiModelProperty()
    longitude: number;
}