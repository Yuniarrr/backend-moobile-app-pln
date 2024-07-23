import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateAlatDto } from './create-alat.dto';

export class UpdateAlatDto extends PartialType(CreateAlatDto) {
  @ApiPropertyOptional({})
  @IsOptional()
  techidentno?: string | null;
}
