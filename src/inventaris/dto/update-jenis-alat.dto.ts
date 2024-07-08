import { PartialType } from '@nestjs/swagger';

import { CreateJenisAlatDto } from './create-jenis-alat.dto';

export class UpdateJenisAlatDto extends PartialType(CreateJenisAlatDto) {}
