/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { type TransformFnParams, Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export function IsStringDefined(description: string, example: string) {
  return applyDecorators(
    Transform((parameters: TransformFnParams) =>
      sanitizeHtml(parameters.value),
    ),
    IsString(),
    IsDefined(),
    IsNotEmpty(),
    ApiProperty({
      description,
      example,
    }),
  );
}
