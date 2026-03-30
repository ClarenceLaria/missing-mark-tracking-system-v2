"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Badge } from '@/app/components/ui/badge';
import { ExamType, ReportStatus, ResolutionNote, Semester } from "@/app/generated/prisma/enums";

interface MissingReport {
  id: number;
  createdAt: Date;
  studentId: number;
  unitId: number;
  examType: ExamType;
  academicYear: string;
  semester: Semester;
  yearOfStudy: number;
  resolutionNote: ResolutionNote | null;
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: MissingReport | null;
}

export default function SingleMissingMarkDialog ({
    open,
    onOpenChange,
    report,
}: Props) {    
    if (!report) return null;

    const statusColor =
        report.reportStatus === 'RESOLVED'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-destructive';
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle>Missing Marks Report</DialogTitle>
                <DialogDescription>
                    Detailed information about the reported missing mark
                </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                {/* Student Info */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    Student Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                        <span className="font-medium">Name:</span>{' '}
                        {report.student.firstName} {report.student.secondName}
                    </p>
                    <p>
                        <span className="font-medium">Reg No:</span>{' '}
                        {report.student.regNo}
                    </p>
                    </div>
                </div>

                {/* Unit Info */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    Unit Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                        <span className="font-medium">Unit Code:</span>{' '}
                        {report.unit.unitCode}
                    </p>
                    <p>
                        <span className="font-medium">Unit Name:</span>{' '}
                        {report.unit.unitName}
                    </p>
                    </div>
                </div>

                {/* Report Info */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    Report Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                        <span className="font-medium">Exam Type:</span>{' '}
                        {report.examType}
                    </p>
                    <p>
                        <span className="font-medium">Academic Year:</span>{' '}
                        {report.academicYear}
                    </p>
                    <p>
                        <span className="font-medium">Semester:</span>{' '}
                        {report.semester}
                    </p>
                    <p>
                        <span className="font-medium">Year of Study:</span>{' '}
                        {report.yearOfStudy}
                    </p>
                    <p>
                        <span className="font-medium">Reported On:</span>{' '}
                        {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Status</p>
                    <Badge className={statusColor}>
                    {report.reportStatus}
                    </Badge>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}