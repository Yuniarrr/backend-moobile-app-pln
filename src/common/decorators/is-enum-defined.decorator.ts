/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { type TransformFnParams, Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export function IsEnumDefined<T extends object>(
  description: string,
  data: T,
  example?: string,
) {
  return applyDecorators(
    Transform((parameters: TransformFnParams) =>
      sanitizeHtml(parameters.value),
    ),
    IsDefined(),
    IsNotEmpty(),
    IsEnum(data),
    ApiProperty({
      description,
      example,
      enum: data,
    }),
  );
}
