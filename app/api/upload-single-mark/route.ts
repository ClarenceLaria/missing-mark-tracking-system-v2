import { prisma } from "@/app/lib/prismadb";
import { error } from "console";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try{
        const body = await req.json();
        const {unitId, regNo, cat, exam} = body;

        if (!unitId || !regNo || !cat || cat === undefined || !exam || exam === undefined) {
            return NextResponse.json(
                {error: "All fields are required"}, {status: 400},
            );
        }

        const student = await prisma.student.findUnique({
            where: {
                regNo: regNo,
            },
            select: {
                id: true
            }
        });

        if(!student) {
            return NextResponse.json(
                {error: "Student does not exist"}, {status: 400},
            );
        }

        const studentId = student.id;

        //confirm if the student has a missing mark in this unit
        const missingMark = await prisma.missingMarksReport.findFirst({
            where: {
                studentId: studentId,
                unitId: Number(unitId),
            }
        });

        if(!missingMark) {
            return NextResponse.json(
                { error: "No missing mark record found for this student and unit" },
                { status: 404 }
            );
        }

        if(missingMark.reportStatus !== "PENDING") {
            return NextResponse.json(
                { error: "This missing mark has already been resolved" },
                { status: 400 }
            );
        }

        // create or update the examMark
        const examMark = await prisma.examMark.upsert({
            where: {
                unitId_studentId: {
                    unitId: Number(unitId),
                    studentId: studentId,
                }
            },
            update: {
                examResult: exam,
                catResult: cat,
            },
            create: {
                unitId: Number(unitId),
                studentId: studentId,
                examResult: exam,
                catResult: cat,
            }
        });

        await prisma.missingMarksReport.update({
            where: {
                id: missingMark.id,
            },
            data: {
                reportStatus: "RESOLVED"
            },
        });

        return NextResponse.json(
            {
                message: "Single mark uploaded successfully and missing mark resolved",
                data: examMark,
            },
            { status: 200 }
        );        
    } catch (error: any) {
        console.error("Error uploading single mark: ", error);

        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500},
        )
    }
}