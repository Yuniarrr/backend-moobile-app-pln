import { IsDateStringDefined, IsStringDefined } from 'common';

export class CreateRencanaPenyelesaianDto {
  @IsDateStringDefined('tanggal', 'tanggal')
  tanggal_rencana: string;

  @IsStringDefined('deskripsi', 'deskripsi')
  deskripsi: string;

  @IsStringDefined('nama', 'nama')
  nama_pembuat: string;

  @IsStringDefined('laporan_anomali_id', 'laporan_anomali_id')
  laporan_anomali_id: string;
}
