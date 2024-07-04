import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CacheModule.register(), AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
