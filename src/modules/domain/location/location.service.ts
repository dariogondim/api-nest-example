import { Inject, Injectable } from '@nestjs/common';

import { LastLocation } from './last-location.entity';
import { CreateUpdateLocationDto } from './dto/create-update-location.dto';
import { RetrieveLocationDto } from './dto/retrieve-location.dto';
import { HistoryLocation } from './history-location.entity';

@Injectable()
export class LocationService {

    constructor(
        @Inject('LastLocationRepository') private readonly lastLocationRepository: typeof LastLocation,
        @Inject('HistoryLocationRepository') private readonly historyLocationRepository: typeof HistoryLocation
    ) { }

    async createAndUpdate(locationDto: CreateUpdateLocationDto): Promise<RetrieveLocationDto> {
        return await this.historyLocationRepository.sequelize.transaction(
            transaction => this.historyLocationRepository.create(
                locationDto,
                { transaction },
            ).then(
                async () => {
                    const lastLocation: [number, LastLocation[]] = await this.lastLocationRepository.update(
                        locationDto,
                        {
                            where: { userId: locationDto.userId },
                            returning: true,
                            transaction
                        }
                    );
                    return new RetrieveLocationDto(lastLocation[1][0]);
                }
            )
        );
    }
}