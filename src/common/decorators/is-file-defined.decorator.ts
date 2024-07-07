/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsObject } from 'class-validator';
import { FileField } from 'nestjs-file-upload';

export function IsFileDefined(
  description: string,
  allowedMimeTypes: string[],
  maxSize: number,
) {
  return applyDecorators(
    Transform(({ value }) => (value === '' ? undefined : value)),
    IsDefined(),
    IsObject(),
    IsNotEmpty(),
    ApiProperty({
      type: String,
      description,
    }),
    Expose(),
    FileField({
      allowedMimeTypes,
      maxSize: maxSize * 1000 * 1000,
    }),
  );
}
