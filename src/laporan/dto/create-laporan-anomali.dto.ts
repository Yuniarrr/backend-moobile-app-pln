/* eslint-disable @darraghor/nestjs-typed/all-properties-have-explicit-defined */
/* eslint-disable @darraghor/nestjs-typed/all-properties-are-whitelisted */
import { Kategori, KategoriPeralatan, PIC } from '@prisma/client';
import {
  IsDateStringDefined,
  IsEnumDefined,
  IsStringDefined,
  IsStringOptional,
} from 'common';
import { IsFileDefined } from 'common/decorators/is-file-defined.decorator';
import { type File } from 'nestjs-file-upload';

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

  @IsDateStringDefined('Tindak lanjut awal', 'tindak lanjut awal')
  tindak_lanjut_awal: string;

  @IsFileDefined('foto upload', ['image/jpeg', 'image/png', 'image/webp'], 5)
  foto: File;

  @IsFileDefined(
    'berita acara upload',
    [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    10,
  )
  berita_acara: File;

  @IsEnumDefined('pic', PIC, PIC.HARGI)
  pic: PIC;

  @IsStringOptional('Detail pic', 'lainnya')
  detail_pic?: string;

  @IsStringDefined('Nama pembuat', 'user')
  nama_pembuat: string;
}
