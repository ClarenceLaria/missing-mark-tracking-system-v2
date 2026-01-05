-- CreateTable
CREATE TABLE "ExamMark" (
    "unitId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "examResult" INTEGER NOT NULL,
    "catResult" INTEGER NOT NULL,

    CONSTRAINT "ExamMark_pkey" PRIMARY KEY ("unitId","studentId")
);

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
