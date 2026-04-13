'use client'
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
import { Button } from "@/app/components/ui/button";
import { Trash2, EyeIcon } from "lucide-react";
import React,{Suspense, useEffect, useState} from 'react'
import Search from '@/app/(users)/student/components/Search'
import { fetchLecturerMissingAndSuspendedMarks } from '@/app/lib/actions';
import { ExamSuspensionStatus, ExamType, ReportStatus, ResolutionNote, Semester } from '@/app/generated/prisma/enums';
import Loader from '@/app/components/Loader';
import SingleMissingMarkDialog from "@/app/components/lecturer/single-missing-mark-dialog";

const Loading = () => <div>Loading...</div>;
interface MissingReport {
  id: number;
  createdAt: Date;
  studentId: number;
  unitId: number;
  examType: ExamType;
  academicYear: string;
  semester: Semester;
  yearOfStudy: number;
  reason: string | null;
  reportStatus: ReportStatus;
  isRegistered: boolean;
  student: {
    id: number;
    firstName: string;
    secondName: string;
    regNo: string;
  };
  unit: {
    unitName: string;
    unitCode: string;
    registeredUnits: {
        registration: {
            studentId: number;
        };
    }[];
  };
}

interface SuspendedMark {
  id: number;
  createdAt: Date;
  studentId: number;
  unitId: number;
  reason: string;
  examResult: number;
  catResult: number;
  status: ExamSuspensionStatus;
  student: {
    id: number;
    firstName: string;
    secondName: string;
    regNo: string;
  };
  unit: {
    unitName: string;
    unitCode: string;
    registeredUnits: {
        registration: {
            studentId: number;
        };
    }[];
  };
}

type combinedMarks = {
  id: number;
  type: "MISSING MARK" | "SUSPENDED MARK";
  name: string;
  regNo: string;
  title: string;
  unitCode: string;
  reason: string | null;
  date: Date;
  status: string;
}
export default function Page() {
    const [missingMarks, setMissingMarks] = useState<MissingReport[]>([]);
    const [suspendedMarks, setSuspendedMarks] = useState<SuspendedMark[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState<Date | null>(null);

    const [open, setOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<MissingReport | null>(null);

    useEffect(() => {
        const handleReports = async () => {
            try{
                setLoading(true);
                const reports = await fetchLecturerMissingAndSuspendedMarks();
                setMissingMarks(reports.enrichedMissingMarks || []);
                setSuspendedMarks(reports.suspendedMarks || []);
                setLoading(false);
            }catch(error){
                console.error('Error fetching reports:', error)
            }
        };
        handleReports();
    },[])

    const transformedReports = missingMarks.map(missingMark => ({
        id: missingMark.id,
        name: `${missingMark.student.firstName} ${missingMark.student.secondName}`,
        regNo: missingMark.student.regNo,
        title: missingMark.unit.unitName,
        unitCode: missingMark.unit.unitCode,
        reason: missingMark.reason,
        date: missingMark.createdAt,
        status: missingMark.reportStatus,
      }));
    
      if(loading) return <Loader/>;
    
      const filteredReports = transformedReports.filter(
        (report) => {
          const matchesSearchTerm =
          !searchTerm ||
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.unitCode.toLowerCase().includes(searchTerm.toLowerCase());
    
          const matchesDate = 
          !searchDate || report.date.toDateString() === searchDate.toDateString();
    
          return matchesSearchTerm && matchesDate;
      });
  return (
    <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Marks Management</h2>
      </div>
      <div>
        <Suspense fallback={<Loading/>}>
          <Search 
          placeholder='Search for a Report...'
          onSearch = {(term) => {
              setSearchTerm(term);
          }}
          ></Search>            
        </Suspense>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Missing and Suspended Marks</CardTitle>
        <CardDescription>Missing and Suspended Marks for Your Units</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student&apos;s Name</TableHead>
              <TableHead>Student&apos;s RegNo</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Mark Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="font-medium">{report.regNo}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.unitCode}</TableCell>
                  <TableCell><h1>Missing or suspended mark</h1></TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.date.toDateString()}</TableCell>
                  <TableCell className={`${
                    report.status === "RESOLVED"
                      ? "text-green-500 font-bold"
                      : "text-destructive font-bold"
                  }`}>{report.status}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="cursor-pointer"
                      onClick={() => {
                        const fullReport = missingMarks.find(r => r.id === report.id);
                        setSelectedReport(fullReport || null);
                        setOpen(true);
                      }}>
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center ">
                There are no reports here!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <SingleMissingMarkDialog report={selectedReport} open={open} onOpenChange={setOpen}/>
  </div>
  )
}
