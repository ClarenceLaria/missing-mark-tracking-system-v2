-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUPERADMIN', 'ADMIN', 'DEAN', 'COD', 'LECTURER', 'STUDENT');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('MAIN', 'SPECIAL', 'SUPPLIMENTARY', 'CAT', 'MAIN_AND_CAT');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('SEMESTER1', 'SEMESTER2', 'SEMESTER3');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'MARK_FOUND', 'MARK_NOT_FOUND', 'FOR_FURTHER_INVESTIGATION');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'LECTURER',
    "departmentId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "userStatus" "UserStatus" NOT NULL DEFAULT 'inactive',

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "yearOfStudy" INTEGER,
    "departmentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'STUDENT',
    "userStatus" "UserStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "yearOfStudy" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'SEMESTER1',
    "lecturerId" INTEGER NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitCourse" (
    "unitId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "UnitCourse_pkey" PRIMARY KEY ("unitId","courseId")
);

-- CreateTable
CREATE TABLE "MissingMarksReport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unitName" TEXT NOT NULL,
    "unitCode" TEXT NOT NULL,
    "lecturerName" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "examType" "ExamType" NOT NULL,
    "reportStatus" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "yearOfStudy" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,
    "studentId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "MissingMarksReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_phoneNumber_key" ON "Staff"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_regNo_key" ON "Student"("regNo");

-- CreateIndex
CREATE UNIQUE INDEX "School_abbreviation_key" ON "School"("abbreviation");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCourse" ADD CONSTRAINT "UnitCourse_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCourse" ADD CONSTRAINT "UnitCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingMarksReport" ADD CONSTRAINT "MissingMarksReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingMarksReport" ADD CONSTRAINT "MissingMarksReport_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
