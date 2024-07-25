/* eslint-disable @darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @darraghor/nestjs-typed/all-properties-have-explicit-defined */
/* eslint-disable @darraghor/nestjs-typed/all-properties-are-whitelisted */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Kategori, KategoriPeralatan } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLaporanAnomaliDto {
  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  ultg_id: string;

  @ApiProperty({ example: 'GI ID' })
  @IsNotEmpty()
  gi_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  jenis_peralatan_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  bay_id: string;

  @ApiPropertyOptional({ example: 'ULTG ID' })
  @IsOptional()
  alat_id?: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  kategori_peralatan: KategoriPeralatan;

  @ApiPropertyOptional({ example: 'ULTG ID' })
  @IsOptional()
  kategori_peralatan_detail?: string | null;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  anomali: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  detail_anomali: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  kategori: Kategori;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  tanggal_rusak: Date;

  // @IsDateStringDefined('Tanggal laporan', '2024-04-25')
  // tanggal_laporan: Date;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  tindak_lanjut_awal: string;

  @ApiPropertyOptional({ description: 'Nameplate' })
  foto?: Express.Multer.File;

  // @IsFileDefined('berita acara upload', 10)
  @ApiPropertyOptional({ description: 'Nameplate' })
  berita_acara?: Express.Multer.File;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  pic: string;

  @ApiPropertyOptional({ example: 'ULTG ID' })
  @IsOptional()
  detail_pic?: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  nama_pembuat: string;
}
