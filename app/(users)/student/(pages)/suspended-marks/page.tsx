"use client";

import { useState } from "react";

interface Student {
  name: string;
  regNo: string;
  courseTitle: string;
  courseCode: string;
  date: string;
  status: "ACTIVE" | "INACTIVE";
  reason: string;
}

const studentsData: Student[] = [
  {
    name: "Jane Doe",
    regNo: "SIT/B/01-00002/2022",
    courseTitle: "Software Engineering",
    courseCode: "BCS 311 / BIT 310",
    date: "Tue Mar 03 2026",
    status: "ACTIVE",
    reason: "Registered",
  },
  {
    name: "John Smith",
    regNo: "SIT/B/01-00005/2022",
    courseTitle: "Database Systems",
    courseCode: "BCS 312 / BIT 311",
    date: "Thu Mar 05 2026",
    status: "INACTIVE",
    reason: "Fees not cleared",
  },
  {
    name: "Mary Johnson",
    regNo: "SIT/B/01-00008/2022",
    courseTitle: "Operating Systems",
    courseCode: "BCS 313 / BIT 312",
    date: "Fri Mar 06 2026",
    status: "ACTIVE",
    reason: "Registered",
  },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");

  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-gray-500">
            Manage registered students
          </p>
        </div>

        <input
          type="text"
          placeholder="Search for a student..."
          className="border rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Student List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">Student's Name</th>
                <th>RegNo</th>
                <th>Course Title</th>
                <th>Course Code</th>
                <th>Date</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">{student.name}</td>
                  <td>{student.regNo}</td>
                  <td>{student.courseTitle}</td>
                  <td>{student.courseCode}</td>
                  <td>{student.date}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td>{student.reason}</td>

                  {/* Actions */}
                  <td>
                    <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg">
                      👁
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}