'use client'
import React, {Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/lecturer/components/Table'
import Search from '@/app/(users)/student/components/Search'
import { useSession } from 'next-auth/react';
import { fetchForwardedReport } from '@/app/lib/actions';
import Loader from '@/app/components/Loader';
import { ExamType, ReportStatus, Semester } from '@/app/generated/prisma/enums';

const Loading = () => <div>Loading...</div>;
interface missingReport {
  academicYear: string;
  yearOfStudy: number;
  semester: Semester;
  examType: ExamType;
  lecturerName: string;
  id: number;
  unitName: string;
  unitCode: string;
  reportStatus: ReportStatus;
  studentId: number;
  createdAt: Date;
}
export default function Page() {
  const [reports, setReports] = useState<missingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const session = useSession();
  const email = session.data?.user?.email!;

  useEffect(() => {
    const handleFetchReport = async () => {
      try{
        setLoading(true)
        const fetchedReports = await fetchForwardedReport(email);
        // setReports(fetchedReports);
        setLoading(false)
      }catch(error){}
    }
    handleFetchReport();
  }, [email])

  if(loading) return <Loader/>
  const transformedReports = reports.map(report => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }));

  const filteredReports = transformedReports.filter(
    (report) => {
      const matchesSearchTerm =
      !searchTerm ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.unitCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = 
      !searchDate || report.date.toDateString() === searchDate.toDateString();

      return matchesSearchTerm && matchesDate;
  });
  return (
    <div className='w-full h-full'>
        <div className='p-10'>
            <h1 className='text-2xl font-bold'>Forwarded Missing Marks</h1>
            <Suspense fallback={<Loading/>}>
                <Search 
                  placeholder='Search for a Pending Missing Mark...'
                  onSearch = {(term, date) => {
                      setSearchDate(date);
                      setSearchTerm(term);
                  }}
                ></Search>
            </Suspense>
            <Suspense fallback={<Loading/>}>
              <Table pageType='forwarded' reports={filteredReports}></Table>
            </Suspense>
        </div>
    </div>
  )
}
