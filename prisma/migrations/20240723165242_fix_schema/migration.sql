-- DropForeignKey
ALTER TABLE "alat" DROP CONSTRAINT "alat_bay_id_fkey";

-- DropForeignKey
ALTER TABLE "alat" DROP CONSTRAINT "alat_dibuat_oleh_fkey";

-- DropForeignKey
ALTER TABLE "alat" DROP CONSTRAINT "alat_gi_id_fkey";

-- DropForeignKey
ALTER TABLE "alat" DROP CONSTRAINT "alat_jenis_peralatan_id_fkey";

-- DropForeignKey
ALTER TABLE "alat" DROP CONSTRAINT "alat_ultg_id_fkey";

-- DropForeignKey
ALTER TABLE "bay" DROP CONSTRAINT "bay_gi_id_fkey";

-- DropForeignKey
ALTER TABLE "gi" DROP CONSTRAINT "gi_ultg_id_fkey";

-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_alat_id_fkey";

-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_bay_id_fkey";

-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_dibuat_oleh_fkey";

-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_diedit_oleh_fkey";

-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_gi_id_fkey";

-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_jenis_peralatan_id_fkey";

-- DropForeignKey
ALTER TABLE "laporan_anomali" DROP CONSTRAINT "laporan_anomali_ultg_id_fkey";

-- DropForeignKey
ALTER TABLE "laporan_tindak_lanjut" DROP CONSTRAINT "laporan_tindak_lanjut_dibuat_oleh_fkey";

-- DropForeignKey
ALTER TABLE "laporan_tindak_lanjut" DROP CONSTRAINT "laporan_tindak_lanjut_laporan_anomali_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_gi_id_fkey";

-- AddForeignKey
ALTER TABLE "gi" ADD CONSTRAINT "gi_ultg_id_fkey" FOREIGN KEY ("ultg_id") REFERENCES "ultg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bay" ADD CONSTRAINT "bay_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_ultg_id_fkey" FOREIGN KEY ("ultg_id") REFERENCES "ultg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_jenis_peralatan_id_fkey" FOREIGN KEY ("jenis_peralatan_id") REFERENCES "jenis_peralatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_bay_id_fkey" FOREIGN KEY ("bay_id") REFERENCES "bay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_alat_id_fkey" FOREIGN KEY ("alat_id") REFERENCES "alat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_anomali" ADD CONSTRAINT "laporan_anomali_diedit_oleh_fkey" FOREIGN KEY ("diedit_oleh") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_tindak_lanjut" ADD CONSTRAINT "laporan_tindak_lanjut_laporan_anomali_id_fkey" FOREIGN KEY ("laporan_anomali_id") REFERENCES "laporan_anomali"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_tindak_lanjut" ADD CONSTRAINT "laporan_tindak_lanjut_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_ultg_id_fkey" FOREIGN KEY ("ultg_id") REFERENCES "ultg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_gi_id_fkey" FOREIGN KEY ("gi_id") REFERENCES "gi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_jenis_peralatan_id_fkey" FOREIGN KEY ("jenis_peralatan_id") REFERENCES "jenis_peralatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_bay_id_fkey" FOREIGN KEY ("bay_id") REFERENCES "bay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
