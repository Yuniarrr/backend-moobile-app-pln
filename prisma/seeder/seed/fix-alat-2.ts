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
  kategori: string;
  jenis_alat: string;
  nama_lokasi: string;
  gi: string;
  funloc_id: string;
  techidentno: string;
  serial_id: string;
  merk: string;
  tipe: string;
  negara: string;
  tahun: string;
  tgl_operasi: string;
  tegangan_operasi: string;
  fasa_terpasang: string;
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
  kapasitas_baterai: string;
  jenis_baterai: string;
  jum_sel: string;
  kapasitas_arus: string;
  v_input_ac: string;
  v_output_dc_floating: string;
  v_output_dc_boosting: string;
  v_output_dc_equalizing: string;
  v_output_load: string;
  kapasitas_baterai_terhubung: string;
  jenis_baterai_terhubung: string;
  jum_sel_baterai_terhubung: string;
  dc_ground: string;
  jenis_relay: string;
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

export const fixAlat2 = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'data-alat-2.json');
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

      // console.log('data.gi');
      // console.log(data.gi);

      const findGi = await prisma.gi.findFirst({
        where: {
          nama: {
            contains: data.gi.trim(),
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

      console.log('findGi');
      console.log(findGi);

      console.log('data.id');
      console.log(data.id);

      const detailAlat = {
        techidentno: data.techidentno,
        kategori_peralatan: findJenisAlat.kategori_peralatan,
        tanggal_operasi:
          data.tgl_operasi === ''
            ? null
            : new Date(`${data.tgl_operasi}-01-01T00:00:00Z`),
        serial_id: data.serial_id === '' ? null : data.serial_id,
        fasa_terpasang:
          data.fasa_terpasang === ''
            ? null
            : (data.fasa_terpasang as FasaTerpasang),
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
        kapasitas_baterai:
          data.kapasitas_baterai === '' ? null : data.kapasitas_baterai,
        jenis_baterai: data.jenis_baterai === '' ? null : data.jenis_baterai,
        jum_sel: data.jum_sel === '' ? null : data.jum_sel,
        kapasitas_arus: data.kapasitas_arus === '' ? null : data.kapasitas_arus,
        v_input_ac: data.v_input_ac === '' ? null : data.v_input_ac,
        v_output_dc_floating:
          data.v_output_dc_floating === '' ? null : data.v_output_dc_floating,
        v_output_dc_boosting:
          data.v_output_dc_boosting === '' ? null : data.v_output_dc_boosting,
        v_output_dc_equalizing:
          data.v_output_dc_equalizing === ''
            ? null
            : data.v_output_dc_equalizing,
        v_output_load: data.v_output_load === '' ? null : data.v_output_load,
        kapasitas_baterai_terhubung:
          data.kapasitas_baterai_terhubung === ''
            ? null
            : data.kapasitas_baterai_terhubung,
        jenis_baterai_terhubung:
          data.jenis_baterai_terhubung === ''
            ? null
            : data.jenis_baterai_terhubung,
        jum_sel_baterai_terhubung:
          data.jum_sel_baterai_terhubung === ''
            ? null
            : data.jum_sel_baterai_terhubung,
        dc_ground: data.dc_ground === '' ? null : data.dc_ground,
        jenis_relay: data.jenis_relay === '' ? null : data.jenis_relay,
        jenis_peralatan_id: findJenisAlat.id,
        bay_id: findBay.id,
        ultg_id: findGi.ultg.id,
        gi_id: findGi.id,
        dibuat_oleh: '5d8d91b2-1c26-4dc3-9df6-86acdc48cc55',
        // dibuat_oleh: '72dd3e37-fd3d-4244-8fef-5a38c74dd126',
      };

      await prisma.alat.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          // dibuat_oleh: '5d8d91b2-1c26-4dc3-9df6-86acdc48cc55',
          ...detailAlat,
        },
        update: {
          ...detailAlat,
        },
      });
    }
    console.log('selesai');
  } catch (error) {
    console.error(`Error in fix alat 2: ${error}`);
  }
};
