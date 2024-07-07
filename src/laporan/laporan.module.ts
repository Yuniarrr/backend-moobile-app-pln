import { Module } from '@nestjs/common';

import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { LaporanController } from './laporan.controller';
import { LaporanService } from './laporan.service';

@Module({
  controllers: [LaporanController],
  providers: [LaporanService, PrismaService, UploadService],
})
export class LaporanModule {}
