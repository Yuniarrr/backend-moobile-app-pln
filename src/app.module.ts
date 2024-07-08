import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { AuthModule } from './auth/auth.module';
import { InventarisModule } from './inventaris/inventaris.module';
import { LaporanModule } from './laporan/laporan.module';
import { ManagementModule } from './management/management.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CacheModule.register(),
    JwtModule.register({
      secret: 'abc',
      signOptions: { expiresIn: '6h' },
      global: true,
    }),
    AuthModule,
    LaporanModule,
    UploadModule,
    ManagementModule,
    InventarisModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
