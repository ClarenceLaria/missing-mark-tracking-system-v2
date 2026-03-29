-- CreateEnum
CREATE TYPE "ResolutionNote" AS ENUM ('DID_NOT_SIT_EXAM', 'DID_NOT_REGISTER');

-- AlterEnum
ALTER TYPE "ReportStatus" ADD VALUE 'OVERRIDDEN';

-- AlterTable
ALTER TABLE "MissingMarksReport" ADD COLUMN     "resolutionNote" "ResolutionNote";
