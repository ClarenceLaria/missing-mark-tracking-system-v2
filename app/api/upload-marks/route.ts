import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { prisma } from "@/app/lib/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response (JSON.stringify({ message: 'Method Not Allowed'}), {status: 405});
  }
  
  try {
    const { unitId } = await req.json();
    const form = formidable({ multiples: false });

    const { fields, files }: any = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    if (!unitId) {
      return NextResponse.json(
        { error: "unitId is required" },
        { status: 400 }
      );
    }

    const file = files.file;
    if (!file) {
      return NextResponse.json(
        { error: "Excel file is required" },
        { status: 400 }
      );
    }

    const workbook = XLSX.readFile(file.filepath);
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

    const uploadedStudentIds = new Set<number>();

    // Upload marks
    for (const row of rows) {
      const regNo = String(row.regNo || "").trim();
      if (!registeredStudents.some((student) => student.regNo === regNo)) continue;

      const studentId = registeredStudents.find((student) => student.regNo === regNo)!.id;

      const exam = row.exam !== undefined ? Number(row.exam) : null;
      const cat = row.cat !== undefined ? Number(row.cat) : null;

      if (exam === null && cat === null) continue;


      const uploadedMarks = await prisma.examMark.upsert({
        where: {
          unitId_studentId: {
            unitId,
            studentId,
          },
        },
        update: {
          ...(exam !== null && { examResult: exam }),
          ...(cat !== null && { catResult: cat }),
        },
        create: {
          unitId,
          studentId,
          examResult: exam ?? 0, // Default to 0 if null
          catResult: cat ?? 0,
        },
        select: { studentId: true},
      });

      uploadedStudentIds.add(uploadedMarks.studentId); 
    }

    // ===============================
    // DETECT MISSING MARKS
    // ===============================

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
      { error: "Failed to upload marks" },
      { status: 500 }
    );
  }
}
