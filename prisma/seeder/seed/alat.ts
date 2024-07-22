import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import {
  FasaTerpasang,
  KategoriPeralatan,
  PrismaClient,
  Role,
  StatusOperasiAlat,
} from '@prisma/client';

const prisma = new PrismaClient();

interface alat {
  id: string;
  techidentno: string;
  kategori_peralatan: KategoriPeralatan;
  kategori_peralatan_detail: string | null;
  tanggal_operasi: string;
  serial_id: string;
  fasa_terpasang: FasaTerpasang;
  mekanik_penggerak: string;
  media_pemadam: string;
  tipe: string;
  merk: string;
  negara_pembuat: string;
  tahun_pembuatan: string;
  tegangan_operasi: string;
  rating_arus: string;
  status: StatusOperasiAlat;
  ultg_id: string;
  gi_id: string;
  jenis_peralatan_id: string;
  bay_id: string;
  dibuat_oleh: string;
}

export const alats = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'alat.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: alat[] = JSON.parse(jsonData);

    for (const data of datas) {
      await prisma.alat.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          techidentno: data.techidentno,
          kategori_peralatan: data.kategori_peralatan,
          kategori_peralatan_detail: data.kategori_peralatan_detail,
          tanggal_operasi: new Date(data.tanggal_operasi),
          serial_id: data.serial_id,
          fasa_terpasang: data.fasa_terpasang,
          mekanik_penggerak: data.mekanik_penggerak,
          media_pemadam: data.media_pemadam,
          tipe: data.tipe,
          merk: data.merk,
          negara_pembuat: data.negara_pembuat,
          tahun_pembuatan: data.tahun_pembuatan,
          tegangan_operasi: data.tegangan_operasi,
          rating_arus: data.rating_arus,
          status: data.status,
          ultg_id: data.ultg_id,
          gi_id: data.gi_id,
          jenis_peralatan_id: data.jenis_peralatan_id,
          bay_id: data.bay_id,
          dibuat_oleh: data.dibuat_oleh,
        },
        update: {
          techidentno: data.techidentno,
          kategori_peralatan: data.kategori_peralatan,
          kategori_peralatan_detail: data.kategori_peralatan_detail,
          tanggal_operasi: new Date(data.tanggal_operasi),
          serial_id: data.serial_id,
          fasa_terpasang: data.fasa_terpasang,
          mekanik_penggerak: data.mekanik_penggerak,
          media_pemadam: data.media_pemadam,
          tipe: data.tipe,
          merk: data.merk,
          negara_pembuat: data.negara_pembuat,
          tahun_pembuatan: data.tahun_pembuatan,
          tegangan_operasi: data.tegangan_operasi,
          rating_arus: data.rating_arus,
          status: data.status,
          ultg_id: data.ultg_id,
          gi_id: data.gi_id,
          jenis_peralatan_id: data.jenis_peralatan_id,
          bay_id: data.bay_id,
          dibuat_oleh: data.dibuat_oleh,
        },
      });
    }
  } catch (error) {
    console.error(`Error in ultg: ${error}`);
  }
};
