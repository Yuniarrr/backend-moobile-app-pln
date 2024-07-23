import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { MulterLaporanConfigService } from './laporan-multer.config';
import { LaporanController } from './laporan.controller';
import { LaporanService } from './laporan.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterLaporanConfigService,
    }),
  ],
  controllers: [LaporanController],
  providers: [LaporanService, PrismaService, UploadService],
})
export class LaporanModule {}
