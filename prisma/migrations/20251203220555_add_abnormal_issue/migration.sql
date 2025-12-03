/*
  Warnings:

  - You are about to drop the column `cmpqty` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `dateYmd` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `itemcd` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `nop` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `nosp` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `planqty` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rtqty` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `setsubicd` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `setuptime` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `st` on the `ProductionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `worktime` on the `ProductionRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductionRecord" DROP COLUMN "cmpqty",
DROP COLUMN "dateYmd",
DROP COLUMN "itemcd",
DROP COLUMN "nop",
DROP COLUMN "nosp",
DROP COLUMN "planqty",
DROP COLUMN "rtqty",
DROP COLUMN "setsubicd",
DROP COLUMN "setuptime",
DROP COLUMN "st",
DROP COLUMN "worktime",
ADD COLUMN     "cycleTime" DOUBLE PRECISION,
ADD COLUMN     "dept" TEXT,
ADD COLUMN     "facility" TEXT,
ADD COLUMN     "itemCode" TEXT,
ADD COLUMN     "itemName" TEXT,
ADD COLUMN     "line" TEXT,
ADD COLUMN     "lossHrs" DOUBLE PRECISION,
ADD COLUMN     "mold" TEXT,
ADD COLUMN     "ngQty" INTEGER,
ADD COLUMN     "okQty" INTEGER,
ADD COLUMN     "prodDate" TIMESTAMP(3),
ADD COLUMN     "qty" INTEGER,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "scanId" TEXT;

-- CreateTable
CREATE TABLE "AbnormalIssue" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "line" TEXT,
    "achievement" INTEGER NOT NULL,
    "problem" TEXT,
    "temporary" TEXT,
    "fix" TEXT,
    "fourM" TEXT,
    "rules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "why" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "repairs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "illustration" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbnormalIssue_pkey" PRIMARY KEY ("id")
);
