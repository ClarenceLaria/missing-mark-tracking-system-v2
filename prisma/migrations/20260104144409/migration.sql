-- CreateTable
CREATE TABLE "SemesterRegistration" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semester" "Semester" NOT NULL,
    "feesCleared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SemesterRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisteredUnit" (
    "registrationId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "RegisteredUnit_pkey" PRIMARY KEY ("registrationId","unitId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SemesterRegistration_studentId_academicYear_semester_key" ON "SemesterRegistration"("studentId", "academicYear", "semester");

-- AddForeignKey
ALTER TABLE "SemesterRegistration" ADD CONSTRAINT "SemesterRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisteredUnit" ADD CONSTRAINT "RegisteredUnit_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "SemesterRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisteredUnit" ADD CONSTRAINT "RegisteredUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
