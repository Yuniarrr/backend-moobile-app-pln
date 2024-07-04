/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GI', 'ADMIN', 'HAR');

-- CreateEnum
CREATE TYPE "Kategori" AS ENUM ('K1', 'K2', 'K3', 'K4');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('OPEN', 'CLOSE', 'DELETE');

-- CreateEnum
CREATE TYPE "PIC" AS ENUM ('JARGI', 'HARGI', 'UPT', 'LAINNYA');

-- CreateEnum
CREATE TYPE "FasaTerpasang" AS ENUM ('R', 'S', 'T', 'RST');

-- CreateEnum
CREATE TYPE "StatusOperasiAlat" AS ENUM ('OPERASI', 'TIDAK_OPERASI', 'DIHAPUS');

-- CreateEnum
CREATE TYPE "KategoriPeralatan" AS ENUM ('PRIMER', 'SEKUNDER', 'PENDUKUNG');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "ultg" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ultg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ultg_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bay" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "gi_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "gi_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_peralatan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori_peralatan" "KategoriPeralatan" NOT NULL DEFAULT 'PRIMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "jenis_peralatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_anomali" (
    "id" TEXT NOT NULL,
    "kategori_peralatan" "KategoriPeralatan" NOT NULL DEFAULT 'PRIMER',
    "anomali" TEXT NOT NULL,
    "detail_anomali" TEXT NOT NULL,
    "kategori" "Kategori" NOT NULL DEFAULT 'K4',
    "tanggal_rusak" TIMESTAMP(3) NOT NULL,
    "tanggal_laporan" TIMESTAMP(3) NOT NULL,
    "batas_waktu" TIMESTAMP(3) NOT NULL,
    "tindak_lanjut_awal" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "berita_acara" TEXT NOT NULL,
    "pic" "PIC" DEFAULT 'LAINNYA',
    "detail_pic" TEXT,
    "nama_pembuat" TEXT NOT NULL,
    "status" "StatusLaporan" NOT NULL DEFAULT 'OPEN',
    "laporan_anomali_id" TEXT NOT NULL,
    "ultg_id" TEXT NOT NULL,
    "gi_id" TEXT NOT NULL,
    "jenis_peralatan_id" TEXT NOT NULL,
    "bay_id" TEXT NOT NULL,
    "alat_id" TEXT NOT NULL,
    "dibuat_oleh" TEXT NOT NULL,
    "diedit_oleh" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "laporan_anomali_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_tindak_lanjut" (
    "id" TEXT NOT NULL,
    "kegiatan" TEXT NOT NULL,
    "ket_kegiatan" TEXT NOT NULL,
    "material" TEXT,
    "waktu_pengerjaan" TIMESTAMP(3) NOT NULL,
    "foto" TEXT,
    "berita_acara" TEXT,
    "nama_pembuat" TEXT NOT NULL,
    "laporan_anomali_id" TEXT NOT NULL,
    "dibuat_oleh" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "laporan_tindak_lanjut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alat" (
    "id" TEXT NOT NULL,
    "tech_id" TEXT,
    "kategori_peralatan" "KategoriPeralatan" NOT NULL DEFAULT 'PRIMER',
    "kategori_peralatan_detail" TEXT,
    "nama" TEXT NOT NULL,
    "merk" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "serial_id" TEXT NOT NULL,
    "negara_pembuat" TEXT NOT NULL,
    "tahun_pembuatan" TEXT NOT NULL,
    "tegangan_operasi" TEXT NOT NULL,
    "fasa_terpasang" "FasaTerpasang" NOT NULL DEFAULT 'R',
    "nameplate" TEXT,
    "status" "StatusOperasiAlat" NOT NULL DEFAULT 'OPERASI',
    "ultg_id" TEXT NOT NULL,
    "gi_id" TEXT NOT NULL,
    "jenis_peralatan_id" TEXT NOT NULL,
    "bay_id" TEXT NOT NULL,
    "dibuat_oleh" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "alat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "gi" ADD CONSTRAINT "gi_ultg_id_fkey" FOREIGN KEY ("ultg_id") REFERENCES "ultg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bay" ADD CONSTRAINT "bay_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_ultg_id_fkey" FOREIGN KEY ("ultg_id") REFERENCES "ultg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_jenis_peralatan_id_fkey" FOREIGN KEY ("jenis_peralatan_id") REFERENCES "jenis_peralatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_bay_id_fkey" FOREIGN KEY ("bay_id") REFERENCES "bay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_alat_id_fkey" FOREIGN KEY ("alat_id") REFERENCES "alat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_diedit_oleh_fkey" FOREIGN KEY ("diedit_oleh") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_tindak_lanjut" ADD CONSTRAINT "laporan_tindak_lanjut_laporan_anomali_id_fkey" FOREIGN KEY ("laporan_anomali_id") REFERENCES "laporan_anomali"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_tindak_lanjut" ADD CONSTRAINT "laporan_tindak_lanjut_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_ultg_id_fkey" FOREIGN KEY ("ultg_id") REFERENCES "ultg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_jenis_peralatan_id_fkey" FOREIGN KEY ("jenis_peralatan_id") REFERENCES "jenis_peralatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_bay_id_fkey" FOREIGN KEY ("bay_id") REFERENCES "bay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
