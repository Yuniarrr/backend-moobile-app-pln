import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { MulterInventarisConfigService } from './inventaris-multer.config';
import { InventarisController } from './inventaris.controller';
import { InventarisService } from './inventaris.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterInventarisConfigService,
    }),
  ],
  controllers: [InventarisController],
  providers: [InventarisService, PrismaService, UploadService, ConfigService],
})
export class InventarisModule {}
