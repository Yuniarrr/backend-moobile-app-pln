/* eslint-disable @darraghor/nestjs-typed/all-properties-are-whitelisted */
/* eslint-disable @darraghor/nestjs-typed/all-properties-have-explicit-defined */
import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsStringOptional } from 'common';
// import * as nestjsFileUpload from 'nestjs-file-upload';
import { FileField, type File } from 'nestjs-file-upload';

export class UploadImageDto {
  @IsStringOptional('upload file path')
  filePath: string;

  @IsStringOptional('upload file name')
  fileName: string;

  @Expose()
  @ApiProperty()
  @FileField({
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1000 * 1000,
  })
  @IsNotEmpty()
  @Type(() => File)
  fileIs: File;
}
