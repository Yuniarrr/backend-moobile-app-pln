import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { KategoriPeralatan } from '@prisma/client';

interface JenisAlat {
  nama: string;
  kategori_peralatan: KategoriPeralatan;
}

export interface JenisAlatFixed {
  id: string;
  nama: string;
  kategori_peralatan: KategoriPeralatan;
}

export const fixedJenisAlat = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'jenis-alat.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: JenisAlat[] = JSON.parse(jsonData);
    let fixed_jenis_alat: JenisAlatFixed[] = [];

    for (const data of datas) {
      fixed_jenis_alat.push({
        id: faker.string.uuid(),
        nama: data.nama,
        kategori_peralatan: data.kategori_peralatan,
      });
    }

    const fixedPath = path.join(
      __dirname,
      '..',
      'data',
      'jenis-alat-fixed.json',
    );

    fs.writeFileSync(fixedPath, JSON.stringify(fixed_jenis_alat, null, 2));
  } catch (error) {
    console.error(`Error in fixed: ${error}`);
  }
};
