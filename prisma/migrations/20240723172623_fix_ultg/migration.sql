/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `ultg` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ultg_id_key" ON "ultg"("id");
