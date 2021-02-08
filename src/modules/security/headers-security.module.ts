import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { HelmetMiddleware } from '@nest-middlewares/helmet';

@Module({})
export class HeadersSecurityModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        HelmetMiddleware.configure({});
        consumer.apply(HelmetMiddleware).forRoutes({ path: '**', method: RequestMethod.ALL });
    }
}