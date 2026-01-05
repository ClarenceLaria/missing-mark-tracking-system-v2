/*
  Warnings:

  - You are about to drop the column `examSessionId` on the `MissingMarksReport` table. All the data in the column will be lost.
  - You are about to drop the `AttendanceCheck` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendanceCheck" DROP CONSTRAINT "AttendanceCheck_confirmedById_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceCheck" DROP CONSTRAINT "AttendanceCheck_examSessionId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceCheck" DROP CONSTRAINT "AttendanceCheck_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSession" DROP CONSTRAINT "ExamSession_unitId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSession" DROP CONSTRAINT "ExamSession_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "MissingMarksReport" DROP CONSTRAINT "MissingMarksReport_examSessionId_fkey";

-- AlterTable
ALTER TABLE "MissingMarksReport" DROP COLUMN "examSessionId";

-- DropTable
DROP TABLE "AttendanceCheck";

-- DropTable
DROP TABLE "ExamSession";
