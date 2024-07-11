/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @darraghor/nestjs-typed/all-properties-have-explicit-defined */
/* eslint-disable @darraghor/nestjs-typed/all-properties-are-whitelisted */
import { ApiProperty } from '@nestjs/swagger';

import { Kategori, KategoriPeralatan, PIC } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsObject } from 'class-validator';
import {
  IsDateStringDefined,
  IsEnumDefined,
  IsStringDefined,
  IsStringOptional,
} from 'common';
import { FileField, type File } from 'nestjs-file-upload';

export class CreateLaporanAnomaliDto {
  @IsStringDefined('ULTG id', 'uuid')
  ultg_id: string;

  @IsStringDefined('GI id', 'uuid')
  gi_id: string;

  @IsStringDefined('jenis peralatan id', 'uuid')
  jenis_peralatan_id: string;

  @IsStringDefined('bay id', 'uuid')
  bay_id: string;

  @IsStringDefined('alat id', 'uuid')
  alat_id: string;

  @IsEnumDefined(
    'Kategori peralatan',
    KategoriPeralatan,
    KategoriPeralatan.PRIMER,
  )
  kategori_peralatan: KategoriPeralatan;

  @IsStringOptional('kategori peralatan detail', 'pendukung')
  kategori_peralatan_detail?: string;

  @IsStringDefined('Anomali', 'Anomali')
  anomali: string;

  @IsStringDefined('Detail anomali', 'Detail anomali')
  detail_anomali: string;

  @IsEnumDefined('Kategori', Kategori, Kategori.K1)
  kategori: Kategori;

  @IsDateStringDefined('Tanggal rusak', '2024-04-25')
  tanggal_rusak: Date;

  @IsDateStringDefined('Tanggal laporan', '2024-04-25')
  tanggal_laporan: Date;

  @IsStringDefined('Tindak lanjut awal', 'tindak lanjut awal')
  tindak_lanjut_awal: string;

  // @IsFileDefined('foto upload', 5, ['image/jpeg', 'image/png', 'image/webp'])
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsDefined()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Upload',
  })
  @Expose()
  @FileField({
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1000 * 1000,
  })
  foto: File;

  // @IsFileDefined('berita acara upload', 10)
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsDefined()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Upload',
  })
  @Expose()
  @FileField({
    // allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1000 * 1000,
  })
  berita_acara: File;

  @IsEnumDefined('pic', PIC, PIC.HARGI)
  pic: PIC;

  @IsStringOptional('Detail pic', 'lainnya')
  detail_pic?: string;

  @IsStringDefined('Nama pembuat', 'user')
  nama_pembuat: string;
}
