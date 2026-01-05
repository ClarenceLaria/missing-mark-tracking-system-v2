'use client'
import Loader from '@/app/components/Loader';
import { fetchAdminTotals, fetchMissingReportsStats, fetchSchoolReportStatistics, fetchSchoolTotals, fetchSchoolUsersTotals } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Grid, Typography, Paper } from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { School, Users, GraduationCap, BookOpen } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: 12,
  },
  {
    name: "Feb",
    total: 15,
  },
  // Add more data points
];

export default function Page() {
    const [pending, setPending] = useState<number>();
    const [found, setFound] = useState<number>();
    const [notFound, setNotFound] = useState<number>();
    const [forwarded, setForwarded] = useState<number>();
    const [cleared, setCleared] = useState<number>();
    const [totalReports, setTotalReports] = useState<number>();
    const [loading, setLoading] = useState(true);
    const [userTotals, setUserTotals] = useState<number>();
    const [studentTotals, setStudentTotals] = useState<number>();
    const [lecturerTotals, setLecturerTotals] = useState<number>();

    const session = useSession();
    const email = session.data?.user?.email!;
    const userType = session.data?.userType;
    useEffect(()=>{
        const handleFetchSchoolTotals = async() => {
            try{
                setLoading(true);
                const result = await fetchSchoolTotals(email);
                setPending(result?.pendingTotals);
                setFound(result?.markFoundTotals);
                setNotFound(result?.markNotFoundTotals);
                setForwarded(result?.forInvestigationTotals);
                setCleared(result?.totalCleared);
                setTotalReports(result?.totalReports);
                setLoading(false);
            }catch(error){
                console.error('Error fetching pending', error);
            }
        };
        handleFetchSchoolTotals();
    }, [email]);

    useEffect(()=>{
        const handleFetchSchoolUserTotals = async() => {
            try{
                setLoading(true);
                const result = await fetchSchoolUsersTotals(email);
                setLecturerTotals(result?.lecturers);
                setStudentTotals(result?.students);
                setUserTotals(result?.totalUsers);
            }catch(error){
                console.error('Error fetching users', error);
            }
        };
        handleFetchSchoolUserTotals();
    },[email]);

    //Admin Logic
    const [adminTotalStudents, setAdminTotalStudents] = useState<number>();
    const [adminTotalLecturers, setAdminTotalLecturers] = useState<number>();
    const [adminTotalSchools, setAdminTotalSchools] = useState<number>();
    const [adminTotalCourses, setAdminTotalCourses] = useState<number>();
    useEffect(() => {
        const handleFetchAdminTotals = async() => {
            try{
                setLoading(true);
                const result = await fetchAdminTotals();
                setAdminTotalStudents(result?.totalStudents);
                setAdminTotalLecturers(result?.totalLecturers);
                setAdminTotalSchools(result?.totalSchools);
                setAdminTotalCourses(result?.totalCourses);
                setLoading(false);
            }catch(error){
                console.error('Error fetching admin totals', error);
            }
        }
        handleFetchAdminTotals();
    },[]);

    //Charts Logic
    const [reportData, setReportData] = useState<{ month: string; missingMarks: number;}[]>([]);

    useEffect(() => {
        const getData = async () => {
          const data = await fetchMissingReportsStats();
          if (data) {
            setReportData(data);
          }
        }
            getData();
    }, []);
    
  if(loading) return <Loader/>;
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalSchools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalLecturers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminTotalCourses}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Missing Marks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={reportData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip  
                contentStyle={{
                  color: '#0070f3', 
                  fontSize: '14px',
                }}
              // formatter={(value, name) => [`${value}`, name]}
              />
              <Bar
                dataKey="missingMarks"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}