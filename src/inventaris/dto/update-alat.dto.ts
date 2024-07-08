import { PartialType } from '@nestjs/swagger';

import { IsStringOptional } from 'common';

import { CreateAlatDto } from './create-alat.dto';

export class UpdateAlatDto extends PartialType(CreateAlatDto) {
  @IsStringOptional('Tech Id')
  techidentno?: string;
}
