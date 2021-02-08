import { Module } from '@nestjs/common';

import { DatabaseModule } from './../../database/database.module';
import { userPrivacyProvider } from './user-privacy.provider';
import { UserPrivacyController } from './user-privacy.controller';
import { UserPrivacyService } from './user-privacy.service';
import { LoggerModule } from '../../logger/logger.module';

@Module({
    imports: [ DatabaseModule, LoggerModule ],
    controllers: [ UserPrivacyController ],
    providers: [
        UserPrivacyService,
        ...userPrivacyProvider
    ],
    exports: [ ...userPrivacyProvider ],
})
export class UserPrivacyModule { }