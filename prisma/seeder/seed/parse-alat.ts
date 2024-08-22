import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Alats {
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

export const parseDataAlat = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'data-alat-2.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: Alats[] = JSON.parse(jsonData);
    const parseDataAlat = [];

    for (const data of datas) {
      parseDataAlat.push({
        id: faker.string.uuid(),
        ...data,
      });
    }

    const userJson = JSON.stringify(parseDataAlat, null, 2);

    fs.writeFile('./prisma/seeder/data/data-funloc-3.json', userJson, err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Success write file');
    });
  } catch (error) {
    console.error(`Error in parseDataAlat: ${error}`);
  }
};
