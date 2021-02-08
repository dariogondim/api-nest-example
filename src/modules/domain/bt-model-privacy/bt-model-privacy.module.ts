import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { btModelPrivacyProvider } from './bt-model-privacy.provider';
import { BtModelPrivacyService } from './bt-model-privacy.service';
import { BtModelPrivacyController } from './bt-model-privacy.controller';
import { LoggerModule } from '../../logger/logger.module';
import { BtModelModule } from '../bt-model/bt-model.module';

@Module({
    imports: [
        DatabaseModule,
        LoggerModule,
        forwardRef(() => BtModelModule) // Usado para resolver dependência circular entre os módulos.
    ],
    controllers: [ BtModelPrivacyController ],
    providers: [
        BtModelPrivacyService,
        ...btModelPrivacyProvider
    ],
    exports: [ ...btModelPrivacyProvider ]
})
export class BtModelPrivacyModule { }