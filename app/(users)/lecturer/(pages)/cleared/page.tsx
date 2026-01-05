'use client'
import React,{Suspense, useEffect, useState} from 'react'
import Table from '@/app/(users)/lecturer/components/Table'
import Search from '@/app/(users)/student/components/Search'
import { fetchClearedReports } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import Loader from '@/app/components/Loader';
import { ExamType, ReportStatus, Semester } from '@/app/generated/prisma/enums';

interface missingReport{
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
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [reports, setReports] = useState<missingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const session = useSession();
  const email = session.data?.user?.email!;
  useEffect(() => {
    const handlefetchReports = async () => {
      try {
        const reports = await fetchClearedReports(email);
        // setReports(reports ?? []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    }
    handlefetchReports();
  }, [email])

  const transformedReports = reports.map(report => ({
    id: report.id,
    title: report.unitName,
    unitCode: report.unitCode,
    date: report.createdAt,
    status: report.reportStatus,
  }));

  if(loading) return <Loader/>;

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
            <h1 className='text-2xl font-bold'>Cleared Missing Marks</h1>
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
              <Table pageType='cleared' reports={filteredReports}></Table>
            </Suspense>
        </div>
    </div>
  )
}
