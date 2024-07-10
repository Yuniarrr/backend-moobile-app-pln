/* eslint-disable unicorn/consistent-function-scoping */
import { ApiBody } from '@nestjs/swagger';

import { Kategori, KategoriPeralatan, PIC } from '@prisma/client';

export const CREATE_LAPORAN_ANOMALI_BODY =
  (): MethodDecorator =>
  (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBody({
      schema: {
        type: 'object',
        required: [
          'ultg_id',
          'gi_id',
          'jenis_peralatan_id',
          'bay_id',
          'alat_id',
          'kategori_peralatan',
          'anomali',
          'detail_anomali',
          'kategori',
          'tanggal_rusak',
          'tanggal_laporan',
          'tindak_lanjut_awal',
          'foto',
          'berita_acara',
          'pic',
          'nama_pembuat',
        ],
        properties: {
          ultg_id: { type: 'string', nullable: false },
          gi_id: { type: 'string', nullable: false },
          jenis_peralatan_id: { type: 'string', nullable: false },
          bay_id: { type: 'string', nullable: false },
          alat_id: { type: 'string', nullable: false },
          kategori_peralatan: {
            type: 'string',
            nullable: false,
            enum: [
              KategoriPeralatan.PRIMER,
              KategoriPeralatan.SEKUNDER,
              KategoriPeralatan.PENDUKUNG,
            ],
            example: KategoriPeralatan.PRIMER,
          },
          anomali: { type: 'string', nullable: false },
          detail_anomali: { type: 'string', nullable: false },
          kategori: {
            type: 'string',
            nullable: false,
            enum: [Kategori.K1, Kategori.K2, Kategori.K3, Kategori.K4],
            example: Kategori.K1,
          },
          tanggal_rusak: { type: 'string', nullable: false },
          tanggal_laporan: { type: 'string', nullable: false },
          tindak_lanjut_awal: { type: 'string', nullable: false },
          foto: { type: 'string', format: 'binary', nullable: false },
          berita_acara: { type: 'string', format: 'binary', nullable: false },
          pic: {
            type: 'string',
            nullable: false,
            enum: [PIC.HARGI, PIC.JARGI, PIC.UPT, PIC.LAINNYA],
            example: PIC.HARGI,
          },
          detail_pic: { type: 'string', nullable: true },
          nama_pembuat: { type: 'string', nullable: false },
        },
      },
    })(target, propertyKey, descriptor);
  };
