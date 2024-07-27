/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { JwtConfig } from 'common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from 'infra/database/prisma/prisma.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConfig.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: { user_id: string; username: string; role: string }) {
    return await this.prisma.users.findFirst({
      where: {
        id: payload.user_id,
        // username: payload.username,
      },
    });
  }
}
