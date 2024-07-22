import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

interface user {
  id: string;
  username: string;
  password: string;
  role: Role;
  gi_id?: string | null;
}

export const users = async () => {
  try {
    const pathFile = path.join(__dirname, '..', 'data', 'users.json');

    const jsonData = await fsPromises.readFile(pathFile, 'utf8');

    const datas: user[] = JSON.parse(jsonData);

    for (const data of datas) {
      await prisma.users.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          username: data.username,
          password: data.password,
          role: data.role,
        },
        update: {
          username: data.username,
          password: data.password,
          role: data.role,
        },
      });
    }
  } catch (error) {
    console.error(`Error in ultg: ${error}`);
  }
};
