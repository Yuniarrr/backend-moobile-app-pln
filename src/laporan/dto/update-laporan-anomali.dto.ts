import { PartialType } from '@nestjs/swagger';

import { StatusLaporan } from '@prisma/client';
import { IsEnumOptional } from 'common';

import { CreateLaporanAnomaliDto } from './create-laporan-anomali.dto';

export class UpdateLaporanAnomaliDto extends PartialType(
  CreateLaporanAnomaliDto,
) {
  @IsEnumOptional('Status', StatusLaporan)
  status?: StatusLaporan;
}
