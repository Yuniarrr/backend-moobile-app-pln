/* eslint-disable unicorn/prefer-string-replace-all */
import * as fs from 'node:fs';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';

import { type UploadPdfDto, type UploadImageDto } from './dto';

@Injectable()
export class UploadService {
  resizeImage(data: UploadImageDto, isTransparent: boolean = false) {
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
      ? `${Date.now()}_${fileName}`
      : `${Date.now()}_${fileName}`;

    // isTransparent
    //   ? await sharp(fileIs.buffer)
    //       .png({ quality: 80 })
    //       .toFile(path.join(newFilePath, newFileName))
    //   : await sharp(fileIs.buffer)
    //       .jpeg({ quality: 80 })
    //       .toFile(path.join(newFilePath, newFileName));
    const pathFile = path.join(newFilePath, newFileName);

    fs.writeFileSync(pathFile, fileIs.buffer);

    return pathFile.replace(/\\/g, '/');
  }

  uploadFile(data: UploadPdfDto): string {
    if (!data.fileIs) {
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
    const newFileName = `${Date.now()}_${fileName}`;
    const filePath = path.join(newFilePath, newFileName);

    fs.writeFileSync(filePath, Buffer.from(fileIs.buffer));

    return filePath.replace(/\\/g, '/');
  }
}
