-- DropForeignKey
ALTER TABLE "alat" DROP CONSTRAINT "alat_jenis_peralatan_id_fkey";

-- AlterTable
ALTER TABLE "alat" ALTER COLUMN "jenis_peralatan_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_jenis_peralatan_id_fkey" FOREIGN KEY ("jenis_peralatan_id") REFERENCES "jenis_peralatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
