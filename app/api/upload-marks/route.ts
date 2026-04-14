import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/app/lib/prismadb";
import { ExamType } from "@/app/generated/prisma/enums";

function getMissingReason(cat: number | null, exam: number | null) {
  if (cat === null && exam === null) return "MISSING_CAT_AND_EXAM";
  if (cat === null) return "MISSING_CAT";
  if (exam === null) return "MISSING_EXAM";
  return null;
}

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Method Not Allowed" }),
      { status: 405 }
    );
  }

  try {
    const formData = await req.formData();

    const unitIdRaw = formData.get("unitId") as string;
    const examTypeRaw = formData.get("examType") as string;
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "Excel file is required" }, { status: 400 });
    if (!unitIdRaw) return NextResponse.json({ error: "unitId is required" }, { status: 400 });
    if (!examTypeRaw || !Object.values(ExamType).includes(examTypeRaw as ExamType)) {
      return NextResponse.json({ error: "Invalid exam type" }, { status: 400 });
    }

    const unitId = Number(unitIdRaw);

    // Read Excel
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });

    // Extract RegNos
    const regNos = rows.map(r => String(r.regNo || "").trim()).filter(Boolean);

    // Fetch Unit
    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) return NextResponse.json({ error: "Unit not found" }, { status: 404 });

    // Fetch relevant students
    const students = await prisma.student.findMany({
      where: { regNo: { in: regNos } },
    });
    const studentMap = new Map(students.map(s => [s.regNo, s]));

    // Fetch registrations for this unit (single query)
    const registrations = await prisma.registeredUnit.findMany({
      where: { unitId },
      include: {
        registration: {
          select: {
            feesCleared: true,
            student: { select: { id: true, regNo: true } },
          },
        },
      },
    });

    const nominalSet = new Set<string>();
    const unpaidSet = new Set<string>();
    for (const r of registrations) {
      const { student, feesCleared } = r.registration;
      if (feesCleared) nominalSet.add(student.regNo);
      else unpaidSet.add(student.regNo);
    }

    // Prepare bulk arrays
    const examMarksToCreate: any[] = [];
    const suspendedMarksToCreate: any[] = [];
    const missingMarksFromRows: any[] = [];
    const uploadedStudentIds = new Set<number>();
    const unknownStudents: string[] = [];

    // Process Excel rows
    for (const row of rows) {
      const regNo = String(row.regNo || "").trim();
      if (!regNo) continue;

      const exam = row.exam !== undefined && row.exam !== "" ? Number(row.exam) : null;
      const cat = row.cat !== undefined && row.cat !== "" ? Number(row.cat) : null;

      const student = studentMap.get(regNo);
      if (!student) {
        unknownStudents.push(regNo);
        continue;
      }

      const isNominal = nominalSet.has(regNo);
      const isUnpaid = unpaidSet.has(regNo);

      let suspensionReason: string | null = null;

      if (!isNominal && isUnpaid) suspensionReason = "FEES_NOT_CLEARED";
      else if (!isNominal) suspensionReason = "DID_NOT_REGISTER";

      if (suspensionReason) {
        suspendedMarksToCreate.push({
          studentId: student.id,
          unitId,
          examResult: exam ?? 0,
          catResult: cat ?? 0,
          reason: suspensionReason,
        });
        continue;
      }

      const missingReason = getMissingReason(cat, exam);

      // Now handle nominal students
      if (missingReason) {
        // Student exists BUT has incomplete marks → Missing Report
        missingMarksFromRows.push({
          studentId: student.id,
          unitId,
          examType: examTypeRaw as ExamType,
          academicYear: unit.academicYear,
          semester: unit.semester,
          yearOfStudy: unit.yearOfStudy,
          reason: missingReason,
        });
      }

      // Nominal student → valid
      examMarksToCreate.push({
        studentId: student.id,
        unitId,
        examResult: exam ?? 0,
        catResult: cat ?? 0,
      });

      uploadedStudentIds.add(student.id);
    }

    // Bulk inserts
    if (examMarksToCreate.length) {
      await prisma.examMark.createMany({
        data: examMarksToCreate,
        skipDuplicates: true, // or consider upsert if you expect re-uploads
      });
    }

    if (suspendedMarksToCreate.length) {
      await prisma.suspendedExamMark.createMany({ data: suspendedMarksToCreate });
    }

    // Detect missing marks (nominal students not uploaded)
    const missingStudents = registrations
      .filter(r => r.registration.feesCleared)
      .map(r => r.registration.student)
      .filter(s => !uploadedStudentIds.has(s.id));

    const missingMarksFromAbsence = missingStudents.map(student => ({
      studentId: student.id,
      unitId,
      examType: examTypeRaw as ExamType,
      academicYear: unit.academicYear,
      semester: unit.semester,
      yearOfStudy: unit.yearOfStudy,
      reason: "MISSING_CAT_AND_EXAM"
    }));

    const allMissingMarks = [...missingMarksFromRows, ...missingMarksFromAbsence];

    if (allMissingMarks.length) {
      await prisma.missingMarksReport.createMany({
        data: allMissingMarks,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      uploaded: examMarksToCreate.length,
      suspended: suspendedMarksToCreate.length,
      missing: allMissingMarks.length,
      unknownStudents,
    }, { status: 200 });

  } catch (error) {
    console.error("Error uploading marks:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}