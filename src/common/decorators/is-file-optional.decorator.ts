/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';
import { FileField } from 'nestjs-file-upload';

export function IsFileOptional(
  description: string,
  maxSize: number,
  allowedMimeTypes?: string[],
) {
  return applyDecorators(
    Transform(({ value }) => (value === '' ? undefined : value)),
    IsOptional(),
    IsObject(),
    ApiPropertyOptional({
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
