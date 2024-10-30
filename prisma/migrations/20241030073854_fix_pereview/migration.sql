-- AlterTable
ALTER TABLE "laporan_anomali" ADD COLUMN     "direview_oleh" TEXT;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_direview_oleh_fkey" FOREIGN KEY ("direview_oleh") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
