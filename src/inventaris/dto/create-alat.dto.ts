import {
  FasaTerpasang,
  KategoriPeralatan,
  StatusOperasiAlat,
} from '@prisma/client';
import {
  IsDateStringDefined,
  IsEnumDefined,
  IsFileDefined,
  IsStringDefined,
  IsStringOptional,
} from 'common';
import { type File } from 'nestjs-file-upload';

export class CreateAlatDto {
  @IsStringDefined('ULTG ID', 'id')
  ultg_id: string;

  @IsStringDefined('GI ID', 'id')
  gi_id: string;

  @IsStringDefined('Jenis Alat ID', 'id')
  jenis_peralatan_id: string;

  @IsStringDefined('Bay Id', 'id')
  bay_id: string;

  @IsEnumDefined(
    'Kategori Peralatan',
    KategoriPeralatan,
    KategoriPeralatan.PRIMER,
  )
  kategori_peralatan: KategoriPeralatan;

  @IsStringOptional('Kategori Peralatan Detail', 'detail')
  kategori_peralatan_detail?: string;

  @IsDateStringDefined('Tanggal Operasi', 'tanggal_operasi')
  tanggal_operasi: Date;

  @IsStringDefined('Serial ID', 'id')
  serial_id: string;

  @IsEnumDefined('Fasa Terpasang', FasaTerpasang, FasaTerpasang.R)
  fasa_terpasang: FasaTerpasang;

  @IsStringOptional('Mekanik Penggerak')
  mekanik_penggerak?: string;

  @IsStringOptional('Media Pemadam')
  media_pemadam?: string;

  @IsStringDefined('Tipe Alat', 'tipe')
  tipe: string;

  @IsStringDefined('Merk Alat', 'merk')
  merk: string;

  @IsStringDefined('Negara Pembuat', 'negara')
  negara_pembuat: string;

  @IsStringDefined('Tahun Pembuatan', 'tahun')
  tahun_pembuatan: string;

  @IsStringDefined('Tegangan Operasi', 'tegangan')
  tegangan_operasi: string;

  @IsStringOptional('Rating Arus')
  rating_arus?: string;

  @IsStringOptional('Breaking Current')
  breaking_current?: string;

  @IsStringOptional('Penempatan')
  penempatan?: string;

  @IsStringOptional('Ratio')
  ratio?: string;

  @IsStringOptional('Jenis CVT')
  jenis_cvt?: string;

  @IsStringOptional('Impedansi')
  impedansi?: string;

  @IsStringOptional('Daya')
  daya?: string;

  @IsStringDefined('Nama Alat', 'nama_alat')
  nama: string;

  @IsFileDefined('Nameplate', 5, ['image/jpeg', 'image/png', 'image/webp'])
  nameplate: File;

  @IsEnumDefined('Status', StatusOperasiAlat, StatusOperasiAlat.OPERASI)
  status: StatusOperasiAlat;
}
