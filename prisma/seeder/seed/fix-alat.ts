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
  jenis_alat: string;
  nama_lokasi: string;
  gi: string;
  funloc_id: string;
  tech_id: string;
  serial_id: string;
  merk: string;
  tipe: string;
  negara: string;
  tahun: string;
  tanggal_operasi: string;
  tegangan_operasi: string;
  fasa: string;
  status: string;
  ratio: string;
  impedansi: string;
  daya: string;
  vector: string;
  jenis_cvt: string;
  rating_arus: string;
  breaking_current: string;
  penempatan: string;
  mekanik_penggerak: string;
  media_pemadam: string;
  arus_dn: string;
}

const changeStatus = (status: string) => {
  switch (status) {
    case 'Operasi':
      return StatusOperasiAlat.OPERASI;
    case 'Tidak Operasi':
      return StatusOperasiAlat.TIDAK_OPERASI;
    case 'Hapus':
      return StatusOperasiAlat.DIHAPUS;
    case 'Digudangkan':
      return StatusOperasiAlat.DIGUDANGKAN;
    case 'Belum Operasi':
      return StatusOperasiAlat.BELUM_OPERASI;
    default:
      return null;
  }
};

export const fixAlat = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'data-alat.json');
    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: alat[] = JSON.parse(jsonData);

    for (const data of datas) {
      const findJenisAlat = await prisma.jenis_peralatan.findFirst({
        where: {
          nama: {
            contains: data.jenis_alat,
          },
        },
      });

      const findBay = await prisma.bay.findFirst({
        where: {
          nama_lokasi: {
            contains: data.nama_lokasi,
          },
        },
      });

      const findGi = await prisma.gi.findFirst({
        where: {
          nama: {
            contains: data.gi,
          },
        },
        include: {
          ultg: {
            select: {
              id: true,
              nama: true,
            },
          },
        },
      });

      const detailAlat = {
        techidentno: data.tech_id,
        kategori_peralatan: findJenisAlat.kategori_peralatan,
        tanggal_operasi:
          data.tanggal_operasi === '' ? null : new Date(data.tanggal_operasi),
        serial_id: data.serial_id === '' ? null : data.serial_id,
        fasa_terpasang: data.fasa === '' ? null : (data.fasa as FasaTerpasang),
        mekanik_penggerak:
          data.mekanik_penggerak === '' ? null : data.mekanik_penggerak,
        media_pemadam: data.media_pemadam === '' ? null : data.media_pemadam,
        tipe: data.tipe === '' ? null : data.tipe,
        merk: data.merk === '' ? null : data.merk,
        negara_pembuat: data.negara === '' ? null : data.negara,
        tahun_pembuatan: data.tahun === '' ? null : data.tahun,
        tegangan_operasi:
          data.tegangan_operasi === '' ? null : data.tegangan_operasi,
        rating_arus: data.rating_arus === '' ? null : data.rating_arus,
        breaking_current:
          data.breaking_current === '' ? null : data.breaking_current,
        penempatan: data.penempatan === '' ? null : data.penempatan,
        ratio: data.ratio === '' ? null : data.ratio,
        jenis_cvt: data.jenis_cvt === '' ? null : data.jenis_cvt,
        impedansi: data.impedansi === '' ? null : data.impedansi,
        daya: data.daya === '' ? null : data.daya,
        vector: data.vector === '' ? null : data.vector,
        arus_dn: data.arus_dn === '' ? null : data.arus_dn,
        status:
          data.status === ''
            ? null
            : (changeStatus(data.status) as StatusOperasiAlat),
      };

      await prisma.alat.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          jenis_peralatan_id: findJenisAlat.id,
          bay_id: findBay.id,
          ultg_id: findGi.ultg.id,
          gi_id: findGi.id,
          dibuat_oleh: 'c6bf3673-80e0-4a14-abb1-c5058f44b1d6',
          ...detailAlat,
        },
        update: {
          jenis_peralatan_id: findJenisAlat.id,
          bay_id: findBay.id,
          ultg_id: findGi.ultg.id,
          gi_id: findGi.id,
          dibuat_oleh: 'c6bf3673-80e0-4a14-abb1-c5058f44b1d6',
          ...detailAlat,
        },
      });
    }
  } catch (error) {
    console.error(`Error in fix alat: ${error}`);
  }
};
