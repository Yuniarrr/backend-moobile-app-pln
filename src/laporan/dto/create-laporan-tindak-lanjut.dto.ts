/* eslint-disable @darraghor/nestjs-typed/all-properties-have-explicit-defined */
/* eslint-disable @darraghor/nestjs-typed/all-properties-are-whitelisted */
/* eslint-disable @darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Kategori, StatusLaporan } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLaporanTindakLanjutDto {
  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  laporan_anomali_id: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  kegiatan: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  ket_kegiatan: string;

  @ApiPropertyOptional({})
  @IsOptional()
  material?: string | null;

  @ApiPropertyOptional({ description: 'Nameplate' })
  @IsOptional()
  foto?: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Nameplate' })
  @IsOptional()
  berita_acara?: Express.Multer.File;

  @ApiPropertyOptional({ example: 'ULTG ID' })
  @IsOptional()
  berita_acara_url?: string;

  @ApiProperty({ example: 'ULTG ID' })
  @IsNotEmpty()
  nama_pembuat: string;

  @ApiPropertyOptional({})
  @IsOptional()
  kategori?: Kategori;

  @ApiPropertyOptional({})
  @IsOptional()
  status?: StatusLaporan;
}
