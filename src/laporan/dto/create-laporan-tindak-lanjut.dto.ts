import { Kategori, StatusLaporan } from '@prisma/client';
import {
  IsDateStringDefined,
  IsEnumOptional,
  IsFileDefined,
  IsStringDefined,
  IsStringOptional,
} from 'common';
import { type File } from 'nestjs-file-upload';

export class CreateLaporanTindakLanjutDto {
  @IsStringDefined('Laporan anomali id', 'id')
  laporan_anomali_id: string;

  @IsStringDefined('Kegiatan', 'Kegiatan harus diisi')
  kegiatan: string;

  @IsStringDefined('Ket Kegiatan', 'Ket Kegiatan harus diisi')
  ket_kegiatan: string;

  @IsStringOptional('Material', 'Material harus diisi')
  material?: string;

  @IsDateStringDefined('Waktu Pengerjaan', '2024-04-25')
  waktu_pengerjaan: Date;

  @IsFileDefined('foto upload', 5, ['image/jpeg', 'image/png', 'image/webp'])
  foto: File;

  @IsFileDefined('berita acara upload', 10)
  berita_acara: File;

  @IsStringDefined('Nama Pembuat', 'Nama Pembuat harus diisi')
  nama_pembuat: string;

  @IsEnumOptional('Ubah kategori', Kategori)
  kategori?: Kategori;

  @IsEnumOptional('Ubah status', StatusLaporan)
  status?: StatusLaporan;
}
