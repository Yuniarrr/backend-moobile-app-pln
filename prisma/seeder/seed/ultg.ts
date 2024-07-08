import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { ULTG_Fixed } from './fixed-ultg';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ultg = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'ultg-fixed.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: ULTG_Fixed[] = JSON.parse(jsonData);

    for (const data of datas) {
      await prisma.ultg.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          nama: data.nama,
        },
        update: {
          nama: data.nama,
        },
      });

      for (const gi of data.list_gi) {
        await prisma.gi.upsert({
          where: { id: gi.id },
          create: {
            id: gi.id,
            nama: gi.nama,
            ultg_id: data.id,
          },
          update: {
            nama: gi.nama,
            ultg_id: data.id,
          },
        });
      }
    }
  } catch (error) {
    console.error(`Error in ultg: ${error}`);
  }
};
