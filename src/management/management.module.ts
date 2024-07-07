import { Module } from '@nestjs/common';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';

@Module({
  controllers: [ManagementController],
  providers: [ManagementService, PrismaService],
})
export class ManagementModule {}
