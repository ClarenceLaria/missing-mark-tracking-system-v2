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
import { Select, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/app/components/ui/select";

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
export default function Page() {
    const [missingMarks, setMissingMarks] = useState<MissingReport[]>([]);
    const [suspendedMarks, setSuspendedMarks] = useState<SuspendedMark[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState<Date | null>(null);

    const [open, setOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<MissingReport | null>(null);

    const [filters, setFilters] = useState({
      markType: "ALL", // MISSING or SUSPENDED
      reason: "ALL", 
      status: "ALL",
      date: null as Date | null,
    });

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

    const transformedMissing = missingMarks.map(m => ({
        id: m.id,
        type: "MISSING",
        name: `${m.student.firstName} ${m.student.secondName}`,
        regNo: m.student.regNo,
        title: m.unit.unitName,
        unitCode: m.unit.unitCode,
        reason: m.reason,
        date: new Date(m.createdAt),
        status: m.reportStatus,
      }));

    const transformedSuspended = suspendedMarks.map(s => ({
      id: s.id,
      type: "SUSPENDED",
      name: `${s.student.firstName} ${s.student.secondName}`,
      regNo: s.student.regNo,
      title: s.unit.unitName,
      unitCode: s.unit.unitCode,
      reason: s.reason,
      date: new Date(s.createdAt),
      status: s.status,
    }));

    const combinedMarks = [...transformedMissing, ...transformedSuspended].sort((a,b) => b.date.getTime() - a.date.getTime());
    
      if(loading) return <Loader/>;
    
      const filteredReports = combinedMarks.filter(
        (report) => {
          const matchesSearchTerm =
          !searchTerm ||
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.unitCode.toLowerCase().includes(searchTerm.toLowerCase());
    
          const matchesFilters =
            (!filters.markType || filters.markType === "ALL" || report.type === filters.markType) &&
            (!filters.status || filters.status === "ALL" || report.status === filters.status) &&
            (!filters.reason || filters.reason === "ALL" || report.reason === filters.reason) &&
            (!filters.date || report.date.toDateString() === filters.date.toDateString());

          return matchesSearchTerm && matchesFilters;
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

    {/* Filters */}
    <div className="flex flex-wrap gap-3 mb-4">
      {/* Mark Type */}
      <Select
      value={filters.markType}
        onValueChange={(value) =>
          setFilters((f) => ({ ...f, markType: value }))
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          <SelectItem value="MISSING">Missing</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(value) =>
          setFilters((f) => ({ ...f, status: value }))
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="RESOLVED">Resolved</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="OVERRIDDEN">Overriden</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
          <SelectItem value="RELEASED">Released</SelectItem>
        </SelectContent>
      </Select>

      {/* Reason */}
      <Select
        value={filters.reason}
        onValueChange={(value) =>
          setFilters((f) => ({ ...f, reason: value }))
        }
      >
        <SelectTrigger className="w-55">
          <SelectValue placeholder="All Reasons" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Reasons</SelectItem>
          <SelectItem value="MISSING_CAT">Missing CAT</SelectItem>
          <SelectItem value="MISSING_EXAM">Missing Exam</SelectItem>
          <SelectItem value="MISSING_CAT_AND_EXAM">
            Missing CAT & Exam
          </SelectItem>
          <SelectItem value="FEES_NOT_CLEARED">
            Fees Not Cleared
          </SelectItem>
          <SelectItem value="DID_NOT_REGISTER">
            Not Registered
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Date */}
      <input
        type="date"
        className="border border-input bg-background rounded-md px-3 py-2 text-sm"
        onChange={(e) =>
          setFilters((f) => ({
            ...f,
            date: e.target.value ? new Date(e.target.value) : null,
          }))
        }
      />

      {/* Reset */}
      <Button
        variant="outline"
        onClick={() =>
          setFilters({
            markType: "ALL",
            reason: "ALL",
            status: "ALL",
            date: null,
          })
        }
      >
        Reset
      </Button>
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
                  <TableCell>{report.type === "MISSING" ? "Missing Mark" : "Suspended Mark"}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.date.toDateString()}</TableCell>
                  <TableCell className={`${
                    report.status === "RESOLVED" || report.status === "RELEASED"
                      ? "text-green-500 font-bold"
                      : "text-destructive font-bold"
                  }`}>{report.status}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="cursor-pointer"
                      onClick={() => {
                        if (report.type === "MISSING") {
                          const fullReport = missingMarks.find(r => r.id === report.id);
                          setSelectedReport(fullReport || null);
                          setOpen(true);
                        } else {
                          // handle suspended mark (different dialog or logic)
                        }
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
