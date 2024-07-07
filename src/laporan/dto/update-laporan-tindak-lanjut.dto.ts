import { PartialType } from '@nestjs/swagger';

import { CreateLaporanTindakLanjutDto } from './create-laporan-tindak-lanjut.dto';

export class UpdateLaporanTindakLanjutDto extends PartialType(
  CreateLaporanTindakLanjutDto,
) {}
