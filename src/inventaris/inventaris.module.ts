import { Module } from '@nestjs/common';

import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { InventarisController } from './inventaris.controller';
import { InventarisService } from './inventaris.service';

@Module({
  controllers: [InventarisController],
  providers: [InventarisService, PrismaService, UploadService],
})
export class InventarisModule {}
