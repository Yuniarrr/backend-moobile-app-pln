/*
  Warnings:

  - You are about to drop the column `tech_id` on the `alat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "alat" DROP COLUMN "tech_id",
ADD COLUMN     "techidentno" TEXT;
