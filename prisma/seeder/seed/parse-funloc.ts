import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Bays {
  nama_lokasi: string;
  gi: string;
  funloc_id: string;
}

export const parseDataFunloc = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'data-funloc-2.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: Bays[] = JSON.parse(jsonData);
    const parseDataBay = [];

    for (const data of datas) {
      parseDataBay.push({
        id: faker.string.uuid(),
        nama_lokasi: data.nama_lokasi,
        gi: data.gi,
        funloc_id: data.funloc_id,
      });
    }

    const userJson = JSON.stringify(parseDataBay, null, 2);

    fs.writeFile('data-funloc.json', userJson, err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Success write file');
    });
  } catch (error) {
    console.error(`Error in parseDataFunloc: ${error}`);
  }
};
