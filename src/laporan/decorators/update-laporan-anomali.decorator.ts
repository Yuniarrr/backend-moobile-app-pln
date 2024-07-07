/* eslint-disable unicorn/consistent-function-scoping */
import { ApiBody } from '@nestjs/swagger';

import {
  Kategori,
  KategoriPeralatan,
  PIC,
  StatusLaporan,
} from '@prisma/client';

export const UPDATE_LAPORAN_ANOMALI_BODY =
  (): MethodDecorator =>
  (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          ultg_id: { type: 'string', nullable: true },
          gi_id: { type: 'string', nullable: true },
          jenis_peralatan_id: { type: 'string', nullable: true },
          bay_id: { type: 'string', nullable: true },
          alat_id: { type: 'string', nullable: true },
          kategori_peralatan: {
            type: 'string',
            nullable: true,
            enum: [
              KategoriPeralatan.PRIMER,
              KategoriPeralatan.SEKUNDER,
              KategoriPeralatan.PENDUKUNG,
            ],
          },
          anomali: { type: 'string', nullable: true },
          detail_anomali: { type: 'string', nullable: true },
          kategori: {
            type: 'string',
            nullable: true,
            enum: [Kategori.K1, Kategori.K2, Kategori.K3, Kategori.K4],
          },
          tanggal_rusak: { type: 'string', nullable: true },
          tanggal_laporan: { type: 'string', nullable: true },
          tindak_lanjut_awal: { type: 'string', nullable: true },
          foto: { type: 'binary', nullable: true },
          berita_acara: { type: 'binary', nullable: true },
          pic: {
            type: 'string',
            nullable: true,
            enum: [PIC.HARGI, PIC.JARGI, PIC.UPT, PIC.LAINNYA],
          },
          detail_pic: { type: 'string', nullable: true },
          nama_pembuat: { type: 'string', nullable: true },
          status: {
            type: 'string',
            nullable: true,
            enum: [
              StatusLaporan.CLOSE,
              StatusLaporan.OPEN,
              StatusLaporan.DELETE,
            ],
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
