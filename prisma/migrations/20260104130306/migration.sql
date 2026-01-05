-- DropIndex
DROP INDEX "AttendanceCheck_examSessionId_key";

-- DropIndex
DROP INDEX "AttendanceCheck_studentId_key";

-- AlterTable
ALTER TABLE "ExamSession" ALTER COLUMN "scannedNominal" DROP NOT NULL;
