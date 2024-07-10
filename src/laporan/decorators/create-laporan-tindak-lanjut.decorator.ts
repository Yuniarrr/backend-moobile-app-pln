/* eslint-disable unicorn/consistent-function-scoping */
import { ApiBody } from '@nestjs/swagger';

export const CREATE_LAPORAN_TINDAK_LANJUT_BODY =
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
          'laporan_anomali_id',
          'kegiatan',
          'ket_kegiatan',
          'waktu_pengerjaan',
          'foto',
          'berita_acara',
          'nama_pembuat',
        ],
        properties: {
          laporan_anomali_id: {
            type: 'string',
            nullable: false,
          },
          kegiatan: { type: 'string', nullable: false },
          ket_kegiatan: { type: 'string', nullable: false },
          material: { type: 'string', nullable: true },
          waktu_pengerjaan: { type: 'string', nullable: false },
          foto: { type: 'string', format: 'binary', nullable: false },
          berita_acara: { type: 'string', format: 'binary', nullable: false },
          nama_pembuat: { type: 'string', nullable: false },
        },
      },
    })(target, propertyKey, descriptor);
  };
