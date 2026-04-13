import cloudinary from "@/app/lib/cloudinary";
import { prisma } from "@/app/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Method Not Allowed" }),
      { status: 405 }
    );
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    const unitId = Number(formData.get("unitId"));
    const academicYear = formData.get("academicYear") as string;
    const semester = formData.get("semester") as any;
    const examType = formData.get("examType") as any;
    const uploadedById = Number(formData.get("uploadedById"));

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: "nominal_rolls",
      resource_type: "auto", // allows PDF, images, etc.
    });

    const fileUrl = uploadResponse.secure_url;

    const roll = await prisma.nominalRoll.upsert({
        where: {
        unitId_academicYear_semester_examType: {
          unitId,
          academicYear,
          semester,
          examType,
        },
        },
        update: {
          fileUrl,
        },
        create: {
          unitId,
          academicYear,
          semester,
          examType,
          fileUrl,
          uploadedById,
        },
    });

    return NextResponse.json({roll}, {status: 201});
  } catch (error) {
    console.error("Error uploading nominall roll:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}