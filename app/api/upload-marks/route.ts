import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/app/lib/prismadb";

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response (JSON.stringify({ message: 'Method Not Allowed'}), {status: 405});
  }
  
  try {
    const formData = await req.formData();

    const unitIdRaw = formData.get("unitId") as string;
    const file = formData.get("file") as File || null;
    if (!file) {
      return NextResponse.json(
        { error: "Excel file is required" },
        { status: 400 }
      );
    }
    if (!unitIdRaw) {
      return NextResponse.json(
        { error: "unitId is required" },
        { status: 400 }
      );
    }
    const unitId = Number(unitIdRaw);

    //Read Excel file
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json(
        { error: "Excel file is empty" },
        { status: 400 }
      );
    }

    // Fetch nominal roll (registered students)
    const registrations = await prisma.registeredUnit.findMany({
      where: {
        unitId
      },
      include: {
        registration: {
          include: {
            student: true,
          }
        }
      }
    });

    const registeredStudents = registrations.map(r => r.registration.student);
    const studentByRegNo = new Map(
      registeredStudents.map((student) => [student.regNo, student])
    )
    const uploadedStudentIds = new Set<number>();

    // upsert(if the mark exists it updates otherwise creates) marks
    for (const row of rows) {
      const regNo = String(row.regNo || "").trim();
      const student = studentByRegNo.get(regNo);

      if (!student) continue;

      const exam =
        row.examResult !== undefined ? Number(row.examResult) : null;
      const cat =
        row.catResult !== undefined ? Number(row.catResult) : null;

      if (exam === null && cat === null) continue;

      const mark = await prisma.examMark.upsert({
        where: {
          unitId_studentId: {
            unitId,
            studentId: student.id,
          },
        },
        update: {
          ...(exam !== null && { examResult: exam }),
          ...(cat !== null && { catResult: cat }),
        },
        create: {
          unitId,
          studentId: student.id,
          examResult: exam ?? 0,
          catResult: cat ?? 0,
        },
        select: { studentId: true },
      });

      uploadedStudentIds.add(mark.studentId);
    }

    // DETECT MISSING MARKS
    const missingStudents = registeredStudents.filter(
      (s) => !uploadedStudentIds.has(s.id)
    );

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
    });

    for (const student of missingStudents) {
      await prisma.missingMarksReport.upsert({
        where: {
          studentId_unitId_examType_academicYear_semester: {
            studentId: student.id,
            unitId: unitId,
            examType: "MAIN",
            academicYear: unit!.academicYear,
            semester: unit!.semester,
          }
        },
        update: {},
        create: {
          studentId: student.id,
          unitId: unitId,
          examType: "MAIN",
          academicYear: unit!.academicYear,
          semester: unit!.semester,
          yearOfStudy: unit!.yearOfStudy,
        },
      });
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedStudentIds.size,
      missingStudents: missingStudents,
      missing: missingStudents.length,
    }, { status: 200 });
  } catch (error) {
    console.error("Error uploading marks:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
