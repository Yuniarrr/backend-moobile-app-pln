import {
  IsDateStringDefined,
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

  @IsDateStringDefined('Waktu Pengerjaan', 'Date harus diisi')
  waktu_pengerjaan: Date;

  @IsFileDefined('foto upload', 5, ['image/jpeg', 'image/png', 'image/webp'])
  foto: File;

  @IsFileDefined('berita acara upload', 10)
  berita_acara: File;

  @IsStringDefined('Nama Pembuat', 'Nama Pembuat harus diisi')
  nama_pembuat: string;
}
