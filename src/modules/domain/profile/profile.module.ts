import { Module } from '@nestjs/common';

import { DatabaseModule } from './../../database/database.module';
import { ProfileService } from './profile.service';
import { profileProvider } from './profile.provider';
import { ProfileController } from './profile.controller';
import { LoggerModule } from '../../logger/logger.module';

@Module({
    imports: [ DatabaseModule, LoggerModule ],
    controllers: [ ProfileController ],
    providers: [
        ProfileService,
        ...profileProvider,
    ],
    exports: [ ...profileProvider ]
})
export class ProfileModule { }