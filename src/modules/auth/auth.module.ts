import { Module, NestModule, MiddlewareConsumer, RequestMethod, forwardRef } from '@nestjs/common';
const passport = require('passport');

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { UserModule } from '../domain/user/user.module';
import { BtModelModule } from '../domain/bt-model/bt-model.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [
        forwardRef(() => UserModule), // Usado para resolver dependência circular entre os módulos.
        BtModelModule,
        LoggerModule
    ],
    controllers: [ AuthController ],
    providers: [
        AuthService,
        AuthJwtStrategy,
    ],
    exports: [ AuthService ],
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        passport.use(new AuthJwtStrategy());
        consumer
        .apply(passport.authenticate(['jwt'], { session: false} ))
        .forRoutes(
            { path: '/models*', method: RequestMethod.ALL },
            { path: '/profiles*', method: RequestMethod.ALL },
            { path: '/locations*', method: RequestMethod.ALL },
            { path: '/messages*', method: RequestMethod.ALL },
            { path: '/auth/revoke', method: RequestMethod.DELETE },
            { path: '/users/ignore', method: RequestMethod.POST },
            { path: '/users-privacy', method: RequestMethod.ALL },
            { path: '/relationships*', method: RequestMethod.ALL },
            { path: '/users', method: RequestMethod.GET },
            { path: '/users/notification', method: RequestMethod.ALL }
        );
    }
}