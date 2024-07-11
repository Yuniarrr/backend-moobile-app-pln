import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AccessTokenStrategy, RefreshTokenStrategy } from 'common';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ConfigService,
  ],
})
export class AuthModule {}
