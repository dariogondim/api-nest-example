import { Module } from '@nestjs/common';

import { DatabaseModule } from './../../database/database.module';
import { MessageService } from './message.service';
import { messageProvider } from './message.provider';
import { MessageController } from './message.controller';
import { FirebaseModule } from '../../firebase/firebase.module';
import { UserModule } from '../user/user.module';
import { BtModelModule } from '../bt-model/bt-model.module';

@Module({
    imports: [ DatabaseModule, FirebaseModule, UserModule, BtModelModule ],
    controllers: [ MessageController ],
    providers: [
        MessageService,
        ...messageProvider
    ],
    exports: [ ...messageProvider ]
})
export class MessageModule { }