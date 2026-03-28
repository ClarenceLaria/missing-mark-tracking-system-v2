"use client";

import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useEffect, useState } from "react";
import { fetchLecturerMissingMarks } from "../../lib/actions";
import { ExamType, ReportStatus, Semester } from '@/app/generated/prisma/enums';

const reports = [
  {
    id: 1,
    student: "John Doe",
    admissionNo: "SCT221-0001/2022",
    course: "BCS 203",
    status: "pending",
    reportedAt: "2024-03-20",
  },
  {
    id: 2,
    student: "Jane Smith",
    admissionNo: "SCT221-0015/2022",
    course: "BIT 301",
    status: "resolved",
    reportedAt: "2024-03-18",
  },
];

interface MissingReport {
  reportStatus: ReportStatus;
  id: number;
  createdAt: Date;
  academicYear: string;
  yearOfStudy: number;
  semester: Semester;
  studentId: number;
  unitId: number;
  examType: ExamType;
  student: {
    firstName: string;
    secondName: string;
    regNo: string;
  };
  unit: {
    unitName: string;
    unitCode: string;
  };
}
export function MissingMarksTable() {
  const [reports, setReports] = useState<MissingReport[]>([]);

  useEffect(() => {
    const handleReports = async () => {
      try{
        const report = await fetchLecturerMissingMarks();
        const fiveReports = report.slice(0,4);
        setReports(fiveReports);
      }catch(error){
        console.error("Error fetching missing marks reports", error);
      }
    };
    handleReports();
  },[]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Marks Reports</CardTitle>
        <CardDescription>Recent missing marks reports from students</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Registration No</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.student.firstName + " " + report.student.secondName}</TableCell>
                  <TableCell>{report.student.regNo}</TableCell>
                  <TableCell>{report.unit.unitCode}</TableCell>
                  <TableCell>
                    <Badge
                      variant={report.reportStatus === ReportStatus.PENDING ? "secondary" : "success"}
                    >
                      {report.reportStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.createdAt.toDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No missing marks reports found!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}