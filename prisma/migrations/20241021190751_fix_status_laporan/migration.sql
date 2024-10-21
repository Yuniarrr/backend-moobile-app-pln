-- CreateEnum
CREATE TYPE "StatusDecision" AS ENUM ('ACCEPT', 'REJECT', 'EDIT', 'AWAITING');

-- AlterTable
ALTER TABLE "laporan_anomali" ADD COLUMN     "status_decision" "StatusDecision" NOT NULL DEFAULT 'AWAITING';
