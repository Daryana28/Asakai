/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Abnormal` table. All the data in the column will be lost.
  - You are about to drop the column `fix` on the `Abnormal` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Abnormal` table. All the data in the column will be lost.
  - You are about to drop the column `rule` on the `Abnormal` table. All the data in the column will be lost.
  - You are about to drop the column `temporary` on the `Abnormal` table. All the data in the column will be lost.
  - Added the required column `achievement` to the `Abnormal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actual` to the `Abnormal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line` to the `Abnormal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Abnormal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan` to the `Abnormal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Abnormal" DROP COLUMN "createdAt",
DROP COLUMN "fix",
DROP COLUMN "image",
DROP COLUMN "rule",
DROP COLUMN "temporary",
ADD COLUMN     "achievement" INTEGER NOT NULL,
ADD COLUMN     "actual" INTEGER NOT NULL,
ADD COLUMN     "fixAction" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "line" TEXT NOT NULL,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "plan" INTEGER NOT NULL,
ADD COLUMN     "rules" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'PENDING',
ADD COLUMN     "tempAction" TEXT,
ALTER COLUMN "problem" DROP NOT NULL,
ALTER COLUMN "fourM" DROP NOT NULL,
ALTER COLUMN "repair" DROP NOT NULL,
ALTER COLUMN "why1" DROP NOT NULL,
ALTER COLUMN "why2" DROP NOT NULL,
ALTER COLUMN "why3" DROP NOT NULL,
ALTER COLUMN "why4" DROP NOT NULL,
ALTER COLUMN "why5" DROP NOT NULL;
