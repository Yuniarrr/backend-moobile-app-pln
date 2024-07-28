import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { ManagementController } from './management.controller';
import { MulterManagementConfigService } from './management.multer';
import { ManagementService } from './management.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterManagementConfigService,
    }),
  ],
  controllers: [ManagementController],
  providers: [ManagementService, PrismaService],
})
export class ManagementModule {}
