/* eslint-disable unicorn/prefer-module */
import { join } from 'node:path';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';

import { JwtConfig } from 'common';

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
      secret: JwtConfig.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: JwtConfig.JWT_EXPIRES_IN },
      global: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      exclude: ['/api/(.*)'],
      serveRoot: '/uploads',
    }),
    AuthModule,
    LaporanModule,
    UploadModule,
    ManagementModule,
    InventarisModule,
    // MulterModule.registerAsync({
    //   useFactory: () => ({
    //     dest: './uploads',
    //   }),
    // }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
