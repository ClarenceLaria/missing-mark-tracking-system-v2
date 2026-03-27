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
import { fetchMissingMarks } from "@/app/lib/actions";
import { ExamType, ReportStatus, Semester } from '@/app/generated/prisma/enums';
import { useEffect, useState } from "react";

const reports = [
  {
    id: 1,
    course: "BCS 203",
    lecturer: "Dr. Jane Smith",
    status: "pending",
    reportedAt: "2024-03-20",
  },
  {
    id: 2,
    course: "BCS 204",
    lecturer: "Prof. John Doe",
    status: "resolved",
    reportedAt: "2024-03-15",
  },
];

interface missingMark {
  id: number;
  createdAt: Date;
  unitCode: string;
  unitName: string;
  lecturerName: string;
  courseName: string;
  examType: ExamType;
  semester: Semester;
  status: ReportStatus;
}
export function MissingMarksHistory() {
  const [reports, setReports] = useState<missingMark []>([]);

  useEffect(() => {
    const handleReports = async () => {
      try{
        const reports = await fetchMissingMarks();
        setReports(reports || []);
      }catch(error){
        console.error("Error fetching reports: ",error)
      }
    };
    handleReports();
  },[]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Marks History</CardTitle>
        <CardDescription>Your reported missing marks and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Lecturer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ?
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.unitCode}</TableCell>
                <TableCell>{report.lecturerName}</TableCell>
                <TableCell>
                  <Badge
                    variant={report.status === ReportStatus.PENDING ? "destructive" : "success"}
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{report.createdAt.toDateString()}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No reports found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}