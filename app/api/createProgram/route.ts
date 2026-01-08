import { prisma } from "@/app/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
    try {
      const body = await req.json();
      const { name, departmentId } = body;

      if (!name || !departmentId) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }
      const program = await prisma.course.create({
        data: {
          name,
          department: {
            connect: { id: departmentId },
          },
        },
      });
      return new Response(
        JSON.stringify({
          message: 'Program created successfully',
          program : {
            id: program.id,
            name: program.name,
            departmentId: program.departmentId,
          },
        }), 
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating program: ', error);
      return new Response(
        JSON.stringify({ error: 'An error occurred while creating program' }),
        { status: 500 }
      );
    }
}