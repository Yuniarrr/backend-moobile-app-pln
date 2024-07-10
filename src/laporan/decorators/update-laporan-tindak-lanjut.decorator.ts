/* eslint-disable unicorn/consistent-function-scoping */
import { ApiBody } from '@nestjs/swagger';

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
          laporan_anomali_id: {
            type: 'string',
            nullable: true,
          },
          kegiatan: { type: 'string', nullable: true },
          ket_kegiatan: { type: 'string', nullable: true },
          material: { type: 'string', nullable: true },
          waktu_pengerjaan: { type: 'string', nullable: true },
          foto: { type: 'string', format: 'binary', nullable: true },
          berita_acara: { type: 'string', format: 'binary', nullable: true },
          nama_pembuat: { type: 'string', nullable: true },
        },
      },
    })(target, propertyKey, descriptor);
  };
