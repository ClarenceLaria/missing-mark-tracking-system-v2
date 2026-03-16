'use client'
import Loader from '@/app/components/Loader';
import { fetchLecturerMissingMarksTotals, fetchLecturerUnits } from '@/app/lib/actions';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CourseList } from "@/app/components/lecturer/course-list";
import { MissingMarksTable } from "@/app/components/lecturer/missing-marks-table";
import { BookOpen, CheckCircle, AlertCircle } from "lucide-react";

export default function Page() {
  const [totals, setTotals] = useState(Number);
  const [pendingTotals, setPendingTotals] = useState(Number);
  const [markFoundTotals, setMarkFoundTotals] = useState(Number);
  const [notFoundTotals, setNotFoundTotals] = useState(Number);
  const [investigationTotals, setInvestigationTotals] = useState(Number);
  const [clearedMarks, setClearedMarks] = useState(Number);
  const [unitTotals, setUnitTotals] = useState(Number);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleReportTotals = async () => {
      setLoading(true);
      const totals = await fetchLecturerMissingMarksTotals();
      setTotals(totals.totalLecsMissingMarks);
      setPendingTotals(totals.pendingTotals);
      setMarkFoundTotals(totals.markFoundTotals);
      setClearedMarks(totals.totalCleared);
      setLoading(false);
    }
    handleReportTotals();
  }, []);

  useEffect(() => {
    const handleUnitTotals = async () => {
      setLoading(true);
      const totals = await fetchLecturerUnits();
      setUnitTotals(totals?.totalUnits || 0);
      setLoading(false);
    }
    handleUnitTotals();
  }, []);

  if (loading) return <Loader/>;
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unitTotals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTotals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{markFoundTotals}</div>
          </CardContent>
        </Card>
      </div>
      <CourseList />
      <MissingMarksTable />
    </div>
  )
}
