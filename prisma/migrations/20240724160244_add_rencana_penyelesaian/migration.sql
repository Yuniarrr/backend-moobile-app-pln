-- CreateTable
CREATE TABLE "rencana_penyelesaian" (
    "id" TEXT NOT NULL,
    "tanggal_rencana" TIMESTAMP(3) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "nama_pembuat" TEXT NOT NULL,
    "dibuat_oleh" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rencana_penyelesaian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rencana_penyelesaian" ADD CONSTRAINT "rencana_penyelesaian_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
