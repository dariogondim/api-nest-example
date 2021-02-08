import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { MorganMiddleware } from '@nest-middlewares/morgan';

import { Logger } from 'winston';
import { LoggerService } from './logger.service';

@Module({
    providers: [ LoggerService ],
    exports: [ LoggerService ]
})
export class LoggerModule implements NestModule {

    private loggerService: LoggerService;

    constructor() {
        this.loggerService = new LoggerService();
    }

    configure(consumer: MiddlewareConsumer) {
        MorganMiddleware.configure('combined', {
            stream: {
                write: (message) => { this.loggerService.log(message); }
            }
        });
        consumer.apply(MorganMiddleware).forRoutes({ path: '**', method: RequestMethod.ALL });
    }
}