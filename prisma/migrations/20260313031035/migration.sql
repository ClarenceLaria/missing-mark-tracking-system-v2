/*
  Warnings:

  - The values [MARK_FOUND,MARK_NOT_FOUND,FOR_FURTHER_INVESTIGATION] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ExamSuspensionStatus" AS ENUM ('SUSPENDED', 'RELEASED');

-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('PENDING', 'RESOLVED');
ALTER TABLE "public"."MissingMarksReport" ALTER COLUMN "reportStatus" DROP DEFAULT;
ALTER TABLE "MissingMarksReport" ALTER COLUMN "reportStatus" TYPE "ReportStatus_new" USING ("reportStatus"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "public"."ReportStatus_old";
ALTER TABLE "MissingMarksReport" ALTER COLUMN "reportStatus" SET DEFAULT 'PENDING';
COMMIT;

-- CreateTable
CREATE TABLE "SuspendedExamMark" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "examResult" INTEGER NOT NULL,
    "catResult" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ExamSuspensionStatus" NOT NULL DEFAULT 'SUSPENDED',

    CONSTRAINT "SuspendedExamMark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SuspendedExamMark" ADD CONSTRAINT "SuspendedExamMark_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuspendedExamMark" ADD CONSTRAINT "SuspendedExamMark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
