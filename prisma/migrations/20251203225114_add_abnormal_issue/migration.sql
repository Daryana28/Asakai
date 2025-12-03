/*
  Warnings:

  - You are about to drop the column `fix` on the `AbnormalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `fourM` on the `AbnormalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `illustration` on the `AbnormalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `problem` on the `AbnormalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `repairs` on the `AbnormalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `rules` on the `AbnormalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `temporary` on the `AbnormalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `why` on the `AbnormalIssue` table. All the data in the column will be lost.
  - Added the required column `actual` to the `AbnormalIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan` to the `AbnormalIssue` table without a default value. This is not possible if the table is not empty.
  - Made the column `line` on table `AbnormalIssue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AbnormalIssue" DROP COLUMN "fix",
DROP COLUMN "fourM",
DROP COLUMN "illustration",
DROP COLUMN "problem",
DROP COLUMN "repairs",
DROP COLUMN "rules",
DROP COLUMN "temporary",
DROP COLUMN "why",
ADD COLUMN     "actual" INTEGER NOT NULL,
ADD COLUMN     "plan" INTEGER NOT NULL,
ALTER COLUMN "line" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
