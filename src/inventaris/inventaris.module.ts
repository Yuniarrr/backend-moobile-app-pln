import { Module } from '@nestjs/common';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { InventarisController } from './inventaris.controller';
import { InventarisService } from './inventaris.service';

@Module({
  controllers: [InventarisController],
  providers: [InventarisService, PrismaService],
})
export class InventarisModule {}
