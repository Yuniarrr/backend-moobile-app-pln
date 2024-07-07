/*
  Warnings:

  - You are about to drop the column `nama` on the `bay` table. All the data in the column will be lost.
  - Added the required column `funloc_id` to the `bay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_lokasi` to the `bay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bay" DROP COLUMN "nama",
ADD COLUMN     "funloc_id" TEXT NOT NULL,
ADD COLUMN     "nama_lokasi" TEXT NOT NULL;
