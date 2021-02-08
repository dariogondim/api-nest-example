import { Module } from '@nestjs/common';

import { DatabaseModule } from './../../database/database.module';
import { RelationshipService } from './relationship.service';
import { relationshipProvider } from './relationship.provider';
import { RelationshipController } from './relationship.controller';
import { FirebaseModule } from '../../firebase/firebase.module';
import { LoggerModule } from '../../logger/logger.module';
import { MessageModule } from '../message/message.module';
import { ProfileModule } from '../profile/profile.module';
import { BtModelModule } from '../bt-model/bt-model.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        DatabaseModule,
        FirebaseModule,
        LoggerModule,
        MessageModule,
        ProfileModule,
        BtModelModule,
        UserModule
    ],
    controllers: [ RelationshipController ],
    providers: [
        RelationshipService,
        ...relationshipProvider
    ],
})
export class RelationshipModule { }