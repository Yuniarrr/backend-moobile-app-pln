import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';

interface GI {
  nama: string;
}

export interface GI_Fixed {
  id: string;
  nama: string;
}

interface ULTG {
  nama: string;
  list_gi: GI[];
}

export interface ULTG_Fixed {
  id: string;
  nama: string;
  list_gi: GI_Fixed[];
}

export const fixedUltg = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'ultg.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: ULTG[] = JSON.parse(jsonData);
    let fixed_utlg: ULTG_Fixed[] = [];

    for (const data of datas) {
      const fixed_gi: GI_Fixed[] = data.list_gi.map(gi => ({
        id: faker.string.uuid(),
        nama: gi.nama,
      }));

      fixed_utlg.push({
        id: faker.string.uuid(),
        nama: data.nama,
        list_gi: fixed_gi,
      });
    }

    const fixedPath = path.join(__dirname, '..', 'data', 'ultg-fixed.json');

    fs.writeFileSync(fixedPath, JSON.stringify(fixed_utlg, null, 2));
  } catch (error) {
    console.error(`Error in fixed: ${error}`);
  }
};
