/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { JwtConfig } from 'common';
import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConfig.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: any) {
    const refreshToken = request
      .get('Authorization')
      .replace('Bearer', '')
      .trim();

    return { ...payload, refreshToken };
  }
}
