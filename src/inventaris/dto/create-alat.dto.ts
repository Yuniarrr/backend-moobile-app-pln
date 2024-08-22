/* eslint-disable @darraghor/nestjs-typed/api-property-returning-array-should-set-array */
/* eslint-disable @darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator */
/* eslint-disable @darraghor/nestjs-typed/all-properties-have-explicit-defined */
/* eslint-disable @darraghor/nestjs-typed/all-properties-are-whitelisted */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  type FasaTerpasang,
  type StatusOperasiAlat,
  type KategoriPeralatan,
} from '@prisma/client';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAlatDto {
  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  ultg_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  gi_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  kategori_peralatan: KategoriPeralatan;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  jenis_peralatan_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  bay_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  tanggal_operasi: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  serial_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  fasa_terpasang: FasaTerpasang;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  tipe: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  merk: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  negara_pembuat: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  tahun_pembuatan: string;

  @ApiPropertyOptional({ example: 'ULTG ID' })
  @IsOptional()
  tegangan_operasi?: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  status: StatusOperasiAlat;

  @ApiPropertyOptional({})
  @IsOptional()
  kategori_peralatan_detail?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  mekanik_penggerak?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  media_pemadam?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  rating_arus?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  breaking_current?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  penempatan?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  ratio?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  jenis_cvt?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  vector?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  arus_dn?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  impedansi?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  daya?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  kapasitas_baterai?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  jenis_baterai?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  jum_sel?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  kapasitas_arus?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  v_input_ac?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  v_output_dc_floating?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  v_output_dc_boosting?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  v_output_dc_equalizing?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  v_output_load?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  kapasitas_baterai_terhubung?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  jenis_baterai_terhubung?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  jum_sel_baterai_terhubung?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  dc_ground?: string | null;

  @ApiPropertyOptional({})
  @IsOptional()
  jenis_relay?: string | null;

  @ApiPropertyOptional({ description: 'Nameplate' })
  nameplate?: Express.Multer.File;
}
