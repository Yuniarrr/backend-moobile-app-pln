import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

interface laporanTL {
  id: string;
  kegiatan: string;
  ket_kegiatan: string;
  material?: string | null;
  waktu_pengerjaan: string;
  foto: string;
  nama_pembuat: string;
  laporan_anomali_id: string;
  dibuat_oleh: string;
}

export const tindakLanjut = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'tindak-lanjut.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: laporanTL[] = JSON.parse(jsonData);

    for (const data of datas) {
      await prisma.laporan_tindak_lanjut.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          kegiatan: data.kegiatan,
          ket_kegiatan: data.ket_kegiatan,
          material: data.material,
          waktu_pengerjaan: new Date(data.waktu_pengerjaan),
          foto: data.foto,
          nama_pembuat: data.nama_pembuat,
          laporan_anomali_id: data.laporan_anomali_id,
          dibuat_oleh: data.dibuat_oleh,
        },
        update: {
          kegiatan: data.kegiatan,
          ket_kegiatan: data.ket_kegiatan,
          material: data.material,
          waktu_pengerjaan: new Date(data.waktu_pengerjaan),
          foto: data.foto,
          nama_pembuat: data.nama_pembuat,
          laporan_anomali_id: data.laporan_anomali_id,
          dibuat_oleh: data.dibuat_oleh,
        },
      });
    }
  } catch (error) {
    console.error(`Error in ultg: ${error}`);
  }
};
