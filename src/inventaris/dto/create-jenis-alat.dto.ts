import { KategoriPeralatan } from '@prisma/client';
import { IsEnumDefined, IsStringDefined } from 'common';

export class CreateJenisAlatDto {
  @IsStringDefined('Nama Jenis Alat', 'jenis_alat')
  nama: string;

  @IsEnumDefined(
    'Kategori Peralatan',
    KategoriPeralatan,
    KategoriPeralatan.PRIMER,
  )
  kategori_peralatan: KategoriPeralatan;
}
