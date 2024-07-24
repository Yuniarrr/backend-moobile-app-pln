import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import {
  FasaTerpasang,
  Kategori,
  KategoriPeralatan,
  PIC,
  PrismaClient,
  Role,
  StatusLaporan,
  StatusOperasiAlat,
} from '@prisma/client';

const prisma = new PrismaClient();

interface anomali {
  id: string;
  kategori_peralatan: KategoriPeralatan;
  kategori_peralatan_detail: string | null;
  anomali: string;
  detail_anomali: string;
  kategori: Kategori;
  tanggal_rusak: string;
  tanggal_laporan: string;
  batas_waktu: string;
  tindak_lanjut_awal: string;
  foto: string;
  berita_acara: string;
  pic: PIC;
  nama_pembuat: string;
  status: StatusLaporan;
  laporan_anomali_id: string;
  ultg_id: string;
  gi_id: string;
  jenis_peralatan_id: string;
  bay_id: string;
  alat_id: string;
  dibuat_oleh: string;
}

export const anomalis = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'anomali.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: anomali[] = JSON.parse(jsonData);

    for (const data of datas) {
      await prisma.laporan_anomali.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          anomali: data.anomali,
          ...data,
        },
        update: {
          anomali: data.anomali,
          ...data,
        },
      });
    }
  } catch (error) {
    console.error(`Error in anomali: ${error}`);
  }
};
