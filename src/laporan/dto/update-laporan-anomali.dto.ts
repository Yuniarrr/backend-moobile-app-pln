/* eslint-disable @darraghor/nestjs-typed/all-properties-have-explicit-defined */
/* eslint-disable @darraghor/nestjs-typed/all-properties-are-whitelisted */
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { StatusReview, StatusLaporan } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsEnumOptional } from 'common';

import { CreateLaporanAnomaliDto } from './create-laporan-anomali.dto';

export class UpdateLaporanAnomaliDto extends PartialType(
  CreateLaporanAnomaliDto,
) {
  @IsEnumOptional('Status', StatusLaporan)
  status?: StatusLaporan;

  @IsEnumOptional('Status', StatusReview)
  status_review?: StatusReview;

  @Transform(({ value }) => value === 'true')
  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  is_delete_berita_acara: boolean;

  @Transform(({ value }) => value === 'true')
  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  is_delete_foto: boolean;
}
