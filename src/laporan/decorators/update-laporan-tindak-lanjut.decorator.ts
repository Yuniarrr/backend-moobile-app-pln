/* eslint-disable unicorn/consistent-function-scoping */
import { ApiBody } from '@nestjs/swagger';

import { Kategori, StatusLaporan } from '@prisma/client';

export const UPDATE_LAPORAN_TINDAK_LANJUT_BODY =
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
          kategori: {
            type: 'string',
            nullable: true,
            enum: [Kategori.K1, Kategori.K2, Kategori.K3, Kategori.K4],
          },
          kegiatan: { type: 'string', nullable: false },
          ket_kegiatan: { type: 'string', nullable: false },
          material: { type: 'string', nullable: true },
          waktu_pengerjaan: { type: 'string', nullable: false },
          foto: { type: 'string', format: 'binary', nullable: false },
          berita_acara: { type: 'string', format: 'binary', nullable: false },
          status: {
            type: 'string',
            nullable: true,
            enum: [
              StatusLaporan.CLOSE,
              StatusLaporan.OPEN,
              StatusLaporan.DELETE,
            ],
          },
          nama_pembuat: { type: 'string', nullable: false },
          laporan_anomali_id: {
            type: 'string',
            nullable: false,
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
