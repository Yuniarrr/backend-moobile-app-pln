/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { type TransformFnParams, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export function IsEnumOptional<T extends object>(description: string, data: T) {
  return applyDecorators(
    Transform((parameters: TransformFnParams) =>
      sanitizeHtml(parameters.value),
    ),
    IsString(),
    IsOptional(),
    IsEnum(data),
    ApiPropertyOptional({
      description,
      nullable: true,
      enum: data,
    }),
  );
}
