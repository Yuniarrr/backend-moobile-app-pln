/* eslint-disable unicorn/consistent-function-scoping */
import { ApiBody } from '@nestjs/swagger';

import {
  FasaTerpasang,
  KategoriPeralatan,
  StatusOperasiAlat,
} from '@prisma/client';

export const UPDATE_ALAT_BODY =
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
          ultg_id: {
            type: 'string',
            nullable: false,
          },
          gi_id: { type: 'string', nullable: false },
          jenis_peralatan_id: { type: 'string', nullable: false },
          bay_id: { type: 'string', nullable: false },
          kategori_peralatan: {
            type: 'string',
            nullable: false,
            enum: Object.values(KategoriPeralatan),
          },
          kategori_peralatan_detail: { type: 'string', nullable: true },
          tanggal_operasi: { type: 'string', nullable: false },
          serial_id: { type: 'string', nullable: false },
          fasa_terpasang: {
            type: 'string',
            nullable: false,
            enum: Object.values(FasaTerpasang),
          },
          mekanik_penggerak: { type: 'string', nullable: true },
          media_pemadam: { type: 'string', nullable: true },
          tipe: { type: 'string', nullable: false },
          merk: { type: 'string', nullable: false },
          negara_pembuat: { type: 'string', nullable: false },
          tahun_pembuatan: { type: 'string', nullable: false },
          tegangan_operasi: { type: 'string', nullable: false },
          rating_arus: { type: 'string', nullable: true },
          breaking_current: { type: 'string', nullable: true },
          penempatan: { type: 'string', nullable: true },
          ratio: { type: 'string', nullable: true },
          jenis_cvt: { type: 'string', nullable: true },
          impedansi: { type: 'string', nullable: true },
          daya: { type: 'string', nullable: true },
          nama: { type: 'string', nullable: false },
          nameplate: { type: 'string', format: 'binary', nullable: false },
          status: {
            type: 'string',
            nullable: false,
            enum: Object.values(StatusOperasiAlat),
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
