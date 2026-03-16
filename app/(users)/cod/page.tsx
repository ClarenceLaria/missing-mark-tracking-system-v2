'use client'
import Loader from '@/app/components/Loader';
import { fetchDepartmentTotals, fetchDepartmentUserTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { BookOpen, UserCircle, GraduationCapIcon } from "lucide-react";
import { CourseList } from "@/app/components/lecturer/course-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { MissingMarksTable } from "@/app/components/lecturer/missing-marks-table";

export default function Page() {
    const [totalReports, setTotalReports] = useState<number>();
    const [pendingTotals, setPendingTotals] = useState(Number);
    const [markFoundTotals, setMarkFoundTotals] = useState(Number);
    const [clearedTotals, setClearedTotals] = useState(Number);
    const [loading, setLoading] = useState(true);
    const [totalLecturers, setTotalLecturers] = useState<number>();
    const [totalStudents, setTotalStudents] = useState<number>()
    const [totalUsers, setTotalUsers] = useState<number>();

    const session= useSession();
    const email = session.data?.user?.email!;
    useEffect(()=>{
        const handleFetchTotals = async() => {
            try{
                setLoading(true);
                const totals = await fetchDepartmentTotals(email) ?? 0;
                if(totals){
                    setTotalReports(totals.totalReports);
                    setPendingTotals(totals.pendingTotals);
                    setMarkFoundTotals(totals.markFoundTotals);
                    setClearedTotals(totals.clearedTotals);
                }
                setLoading(false);
            }catch(error){
                console.error('Error fetching totals', error);
            }
        };
        handleFetchTotals();
    }, [email])
        
    useEffect(() => {
        const handleUserTotals = async() =>{
            setLoading(true)
            const userTotals = await fetchDepartmentUserTotals(email);
            if(userTotals){
                setTotalLecturers(userTotals.lecturers);
                setTotalStudents(userTotals.students);
                setTotalUsers(userTotals.totalUsers);
            }
        }
        handleUserTotals();
    }, [email])
    if (loading) return <Loader/>;
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Marks Reports</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lecturers</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLecturers}</div>
          </CardContent>
        </Card>
      </div>
      <CourseList />
      <MissingMarksTable />
    </div>
  )
}
