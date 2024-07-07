import * as fs from 'node:fs';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';

import sharp from 'sharp';

import { type CreateUploadDto } from './dto';

@Injectable()
export class UploadService {
  async resizeImage(
    data: CreateUploadDto,
    isTransparent: boolean = false,
  ): Promise<string> {
    if (data.fileIs === undefined) {
      return null;
    }

    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    const newFilePath = path.join('uploads', data.filePath);

    if (!fs.existsSync(newFilePath)) {
      fs.mkdirSync(newFilePath, { recursive: true });
    }

    const { fileName, fileIs } = data;

    const newFileName = isTransparent
      ? `${Date.now()}_${fileName}.png`
      : `${Date.now()}_${fileName}.jpeg`;

    isTransparent
      ? await sharp(fileIs.buffer)
          .png({ quality: 80 })
          .toFile(path.join(newFilePath, newFileName))
      : await sharp(fileIs.buffer)
          .jpeg({ quality: 80 })
          .toFile(path.join(newFilePath, newFileName));

    return newFileName;
  }
}
