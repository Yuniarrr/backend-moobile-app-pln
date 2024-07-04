import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }

  @ApiProperty({
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    example: 'error message',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | Array<string>;
}
