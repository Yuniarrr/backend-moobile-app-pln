import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { AuthModule } from './auth/auth.module';
import { LaporanModule } from './laporan/laporan.module';
import { ManagementModule } from './management/management.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CacheModule.register(),
    AuthModule,
    LaporanModule,
    UploadModule,
    ManagementModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
