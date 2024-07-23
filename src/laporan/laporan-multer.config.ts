/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';
import {
  type MulterOptionsFactory,
  type MulterModuleOptions,
} from '@nestjs/platform-express';

import * as multer from 'multer';

@Injectable()
export class MulterLaporanConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: join('./uploads/laporan'),
        filename: (request, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${file.originalname}`,
          );
        },
      }),
    };
  }
}
