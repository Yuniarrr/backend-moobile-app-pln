import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class MeDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    description: 'User ID.',
    example: '1',
  })
  user_id: string;
}
