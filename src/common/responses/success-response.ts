/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @darraghor/nestjs-typed/api-property-matches-property-optionality */
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  constructor(
    statusCode: number,
    message: string,
    data?: string | string[] | object | object[],
  ) {
    this.statusCode = statusCode;
    this.message = message;

    if (data !== undefined) {
      this.data = data;
    }
  }

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: 'data',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
      { type: 'object' },
      { type: 'array', items: { type: 'object' } },
    ],
    required: false,
  })
  data?: string | string[] | object;
}
