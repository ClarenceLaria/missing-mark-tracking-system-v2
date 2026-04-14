/*
  Warnings:

  - The `reason` column on the `MissingMarksReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MissingMarkReason" AS ENUM ('MISSING_CAT', 'MISSING_EXAM', 'MISSING_CAT_AND_EXAM');

-- AlterTable
ALTER TABLE "MissingMarksReport" DROP COLUMN "reason",
ADD COLUMN     "reason" "MissingMarkReason";
