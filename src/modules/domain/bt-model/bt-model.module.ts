import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from './../../database/database.module';
import { BtModelService } from './bt-model.service';
import { btModelProvider } from './bt-model.provider';
import { BtModelController } from './bt-model.controller';
import { UtilModule } from '../../util/util.module';
import { LoggerModule } from '../../logger/logger.module';
import { BtModelPrivacyModule } from '../bt-model-privacy/bt-model-privacy.module';
import { UserPrivacyModule } from '../user-privacy/user-privacy.module';

@Module({
    imports: [
        DatabaseModule,
        LoggerModule,
        forwardRef(() => BtModelPrivacyModule), // Usado para resolver dependência circular entre os módulos.
        UserPrivacyModule,
        UtilModule
    ],
    controllers: [ BtModelController ],
    providers: [
        BtModelService,
        ...btModelProvider
    ],
    exports: [ ...btModelProvider ]
})
export class BtModelModule { }