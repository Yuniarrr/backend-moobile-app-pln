-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_bay_id_fkey";

-- AlterTable
ALTER TABLE "laporan_anomali" ALTER COLUMN "bay_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_bay_id_fkey" FOREIGN KEY ("bay_id") REFERENCES "bay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
