import { PrismaClient } from '@prisma/client';
import { jenisAlat, ultg } from './seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding Bina Bakat');
  try {
    await ultg();
    await jenisAlat();
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
