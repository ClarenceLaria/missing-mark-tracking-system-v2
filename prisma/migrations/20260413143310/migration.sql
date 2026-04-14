/*
  Warnings:

  - You are about to drop the column `resolutionNote` on the `MissingMarksReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MissingMarksReport" DROP COLUMN "resolutionNote",
ADD COLUMN     "reason" TEXT;
