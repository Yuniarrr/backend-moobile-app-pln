import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    description: 'Refresh token.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MjYwNjIwNzYsImV4cCI6MTYyNjA2MjA3N30.1',
  })
  refresh_token: string;
}
