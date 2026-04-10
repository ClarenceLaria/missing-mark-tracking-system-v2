-- CreateTable
CREATE TABLE "NominalRoll" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unitId" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semester" "Semester" NOT NULL,
    "examType" "ExamType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedById" INTEGER NOT NULL,

    CONSTRAINT "NominalRoll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NominalRoll_unitId_academicYear_semester_examType_key" ON "NominalRoll"("unitId", "academicYear", "semester", "examType");

-- AddForeignKey
ALTER TABLE "NominalRoll" ADD CONSTRAINT "NominalRoll_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NominalRoll" ADD CONSTRAINT "NominalRoll_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
