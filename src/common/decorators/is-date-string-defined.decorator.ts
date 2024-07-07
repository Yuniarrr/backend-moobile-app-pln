/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { type TransformFnParams, Transform } from 'class-transformer';
import { IsDateString, IsDefined, IsNotEmpty } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export function IsDateStringDefined(description: string, example: string) {
  return applyDecorators(
    Transform(({ value }) => (value === '' ? undefined : value)),
    Transform((parameters: TransformFnParams) =>
      sanitizeHtml(parameters.value),
    ),
    IsDateString(),
    IsDefined(),
    IsNotEmpty(),
    ApiProperty({
      description,
      example,
    }),
  );
}
