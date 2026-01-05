/*
  Warnings:

  - A unique constraint covering the columns `[studentId,unitId,examType,academicYear,semester]` on the table `MissingMarksReport` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "reportId" INTEGER NOT NULL,
    "role" "UserType" NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MissingMarksReport_studentId_unitId_examType_academicYear_s_key" ON "MissingMarksReport"("studentId", "unitId", "examType", "academicYear", "semester");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MissingMarksReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
