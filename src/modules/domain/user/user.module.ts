import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from './../../database/database.module';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { ignoredUserProvider } from './ignored-user.provider';
import { notificationUserProvider } from './notification-user.provider';
import { ProfileModule } from '../profile/profile.module';
import { LocationModule } from '../location/location.module';
import { BtModelModule } from '../bt-model/bt-model.module';
import { BtModelPrivacyModule } from '../bt-model-privacy/bt-model-privacy.module';
import { UserPrivacyModule } from '../user-privacy/user-privacy.module';
import { LoggerModule } from '../../logger/logger.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [
        DatabaseModule,
        forwardRef(() => AuthModule), // Usado para resolver dependência circular entre os módulos.
        ProfileModule,
        LocationModule,
        BtModelModule,
        BtModelPrivacyModule,
        UserPrivacyModule,
        LoggerModule
    ],
    controllers: [ UserController ],
    providers: [
        UserService,
        ...userProvider,
        ...notificationUserProvider,
        ...ignoredUserProvider
    ],
    exports: [ UserService, ...userProvider, ...ignoredUserProvider, ...notificationUserProvider ],
})
export class UserModule { }