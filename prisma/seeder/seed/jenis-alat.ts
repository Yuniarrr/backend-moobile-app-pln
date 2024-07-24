import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { JenisAlatFixed } from './fixed-jenis-alat';

const prisma = new PrismaClient();

export const jenisAlat = async () => {
  try {
    const pathFile = path.join(
      __dirname,
      '..',
      'data',
      'jenis-alat-fixed.json',
    );

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: JenisAlatFixed[] = JSON.parse(jsonData);

    for (const data of datas) {
      await prisma.jenis_peralatan.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          nama: data.nama,
          kategori_peralatan: data.kategori_peralatan,
        },
        update: {
          nama: data.nama,
          kategori_peralatan: data.kategori_peralatan,
        },
      });
    }
  } catch (error) {
    console.error(`Error in jenisAlat: ${error}`);
  }
};
