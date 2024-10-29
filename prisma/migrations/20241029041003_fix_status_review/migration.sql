/*
  Warnings:

  - You are about to drop the column `status_decision` on the `laporan_anomali` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusReview" AS ENUM ('ACCEPT', 'REJECT', 'EDIT', 'AWAITING');

-- AlterTable
ALTER TABLE "laporan_anomali" DROP COLUMN "status_decision",
ADD COLUMN     "status_review" "StatusReview" NOT NULL DEFAULT 'AWAITING';

-- DropEnum
DROP TYPE "StatusDecision";
