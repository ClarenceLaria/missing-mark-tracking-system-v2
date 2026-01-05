/*
  Warnings:

  - You are about to drop the column `lecturerName` on the `MissingMarksReport` table. All the data in the column will be lost.
  - You are about to drop the column `unitCode` on the `MissingMarksReport` table. All the data in the column will be lost.
  - You are about to drop the column `unitName` on the `MissingMarksReport` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `examSessionId` to the `MissingMarksReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitCode` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitName` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- AlterTable
ALTER TABLE "MissingMarksReport" DROP COLUMN "lecturerName",
DROP COLUMN "unitCode",
DROP COLUMN "unitName",
ADD COLUMN     "examSessionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "code",
DROP COLUMN "name",
ADD COLUMN     "unitCode" TEXT NOT NULL,
ADD COLUMN     "unitName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ExamSession" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "examType" "ExamType" NOT NULL,
    "academicYear" TEXT NOT NULL,
    "scannedNominal" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedById" INTEGER NOT NULL,

    CONSTRAINT "ExamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceCheck" (
    "examSessionId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "attendanceStatus" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "confirmedById" INTEGER NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceCheck_pkey" PRIMARY KEY ("examSessionId","studentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamSession_unitId_key" ON "ExamSession"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSession_academicYear_key" ON "ExamSession"("academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceCheck_examSessionId_key" ON "AttendanceCheck"("examSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceCheck_studentId_key" ON "AttendanceCheck"("studentId");

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceCheck" ADD CONSTRAINT "AttendanceCheck_examSessionId_fkey" FOREIGN KEY ("examSessionId") REFERENCES "ExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceCheck" ADD CONSTRAINT "AttendanceCheck_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceCheck" ADD CONSTRAINT "AttendanceCheck_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingMarksReport" ADD CONSTRAINT "MissingMarksReport_examSessionId_fkey" FOREIGN KEY ("examSessionId") REFERENCES "ExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
