import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthJwtStrategy extends Strategy {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: '4cc355t0k3n53cr3tk3y',
      },
      (req, payload, next) => next(null, payload),
    );
  }
}