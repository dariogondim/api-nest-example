import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { ProfileModule } from './domain/profile/profile.module';
import { BtModelModule } from './domain/bt-model/bt-model.module';
import { RelationshipModule } from './domain/relationship/relationship.module';
import { LocationModule } from './domain/location/location.module';
import { MessageModule } from './domain/message/message.module';
import { UserPrivacyModule } from './domain/user-privacy/user-privacy.module';
import { BtModelPrivacyModule } from './domain/bt-model-privacy/bt-model-privacy.module';
import { LoggerModule } from './logger/logger.module';
import { HeadersSecurityModule } from './security/headers-security.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    HeadersSecurityModule,
    LoggerModule,
    UserModule,
    ProfileModule,
    BtModelModule,
    RelationshipModule,
    LocationModule,
    MessageModule,
    AuthModule,
    UserPrivacyModule,
    BtModelPrivacyModule,
    FirebaseModule
  ],
  controllers: [ AppController ],
  providers: [ ],
})
export class AppModule { }