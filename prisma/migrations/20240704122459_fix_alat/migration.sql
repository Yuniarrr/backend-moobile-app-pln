/*
  Warnings:

  - Added the required column `tanggal_operasi` to the `alat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alat" ADD COLUMN     "breaking_current" TEXT,
ADD COLUMN     "daya" TEXT,
ADD COLUMN     "impedansi" TEXT,
ADD COLUMN     "jenis_cvt" TEXT,
ADD COLUMN     "media_pemadam" TEXT,
ADD COLUMN     "mekanik_penggerak" TEXT,
ADD COLUMN     "penempatan" TEXT,
ADD COLUMN     "rating_arus" TEXT,
ADD COLUMN     "ratio" TEXT,
ADD COLUMN     "tanggal_operasi" TIMESTAMP(3) NOT NULL;
