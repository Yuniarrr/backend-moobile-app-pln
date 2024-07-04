/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { type TransformFnParams, Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export function IsStringOptional(description: string, example?: string) {
  return applyDecorators(
    Transform((parameters: TransformFnParams) =>
      sanitizeHtml(parameters.value),
    ),
    IsString(),
    IsOptional(),
    ApiPropertyOptional({
      description,
      example,
      nullable: true,
    }),
  );
}
