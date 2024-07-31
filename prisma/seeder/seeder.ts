import { PrismaClient } from '@prisma/client';
import {
  jenisAlat,
  ultg,
  bay,
  users,
  alats,
  tindakLanjut,
  fixAlat,
  anomalis,
} from './seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding Backend');
  try {
    await ultg();
    await jenisAlat();
    await bay();
    // await users();
    // await alats();
    // await tindakLanjut(); // just for prod
    await fixAlat();
    // await anomalis();
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    // console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
