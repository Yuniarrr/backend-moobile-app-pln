-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ultg_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_ultg_id_fkey" FOREIGN KEY ("ultg_id") REFERENCES "ultg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
