import { Semester } from "@/app/generated/prisma/enums";
import { prisma } from "@/app/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    if(req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    try{
        const body = await req.json();
        const { code, name, academicYear, yearofStudy, semester, courses } = body;
        if(!code || !name || !academicYear || !yearofStudy || !semester || !courses){
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const lecturerId = 2;
        const course = await prisma.unit.create({
            data: {
                unitName: name,
                unitCode: code,
                academicYear,
                yearOfStudy: yearofStudy,
                semester: semester as Semester,
                lecturer: {
                    connect: { id: lecturerId }, // Ensure lecturerId exists
                  },
                courses: {
                    create: courses.map((courseId: number) => ({
                        course: {
                            connect: { id: parseInt(courseId.toString()) },
                        },
                    })),
                },
            },
            include: {
                courses: {
                    select: {
                        course: true,
                    },
                },
            },
        });
        return new Response(
            JSON.stringify({ 
                message: 'Course created successfully', 
                course:{
                    id: course.id,
                    unitCode: course.unitCode,
                    academicYear: course.academicYear,
                    yearOfStudy: course.yearOfStudy,
                    semester: course.semester,
                    lecturerId: course.lecturerId,
                    courses: course.courses.map((uc) => uc.course),
                }, 
            }),
        );
    }catch(error){
        console.error('Error creating course: ', error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while creating course' }),
            {status: 500}
        );
    }
}