import { Module } from '@nestjs/common';

import { DatabaseModule } from './../../database/database.module';
import { LocationService } from './location.service';
import { lastLocationProvider } from './last-location.provider';
import { historyLocationProvider } from './history-location.provider';
import { LocationController } from './location.controller';

@Module({
    imports: [ DatabaseModule ],
    controllers: [ LocationController ],
    providers: [
        LocationService,
        ...lastLocationProvider,
        ...historyLocationProvider
    ],
    exports: [ ...lastLocationProvider, ...historyLocationProvider ],
})
export class LocationModule { }