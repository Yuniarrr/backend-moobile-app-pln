/*
  Warnings:

  - A unique constraint covering the columns `[laporan_anomali_id]` on the table `rencana_penyelesaian` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `laporan_anomali_id` to the `rencana_penyelesaian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rencana_penyelesaian" ADD COLUMN     "laporan_anomali_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "rencana_penyelesaian_laporan_anomali_id_key" ON "rencana_penyelesaian"("laporan_anomali_id");

-- AddForeignKey
ALTER TABLE "rencana_penyelesaian" ADD CONSTRAINT "rencana_penyelesaian_laporan_anomali_id_fkey" FOREIGN KEY ("laporan_anomali_id") REFERENCES "laporan_anomali"("id") ON DELETE CASCADE ON UPDATE CASCADE;
