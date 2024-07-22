import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import csv from 'csvtojson';

const prisma = new PrismaClient();

export const bay = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'bay.csv');
    const dataBay = await csv().fromFile(pathFile);

    const dataGi = await prisma.gi.findMany({
      select: {
        nama: true,
        id: true,
      },
    });

    const giMap = new Map();
    dataGi.forEach(gi => {
      giMap.set(gi.nama, gi.id);
    });

    for (const bay of dataBay) {
      const gi_id = giMap.get(bay.gi);

      if (gi_id) {
        await prisma.bay.upsert({
          where: { id: bay.id },
          update: {
            nama_lokasi: bay.nama_lokasi,
            funloc_id: bay.funloc_id,
            gi_id,
          },
          create: {
            id: bay.id,
            nama_lokasi: bay.nama_lokasi,
            funloc_id: bay.funloc_id,
            gi_id,
          },
        });
      } else {
        console.warn(`GI not found for bay: ${bay.nama_lokasi}`);
      }
    }

    console.log('Upsert complete.');
  } catch (error) {
    console.error(`Error in bay: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
};
