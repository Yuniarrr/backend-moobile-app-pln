import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { CreateAlatDto } from './create-alat.dto';

export class UpdateAlatDto extends PartialType(CreateAlatDto) {
  @ApiPropertyOptional({})
  @IsOptional()
  techidentno?: string | null;

  @Transform(({ value }) => value === 'true')
  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  is_delete_nameplate: boolean;
}
