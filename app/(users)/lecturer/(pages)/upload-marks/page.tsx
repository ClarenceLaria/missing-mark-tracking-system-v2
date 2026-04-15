"use client";

import SingleMarkDialog from "@/app/components/lecturer/single-mark-dialog";
import { Button } from "@/app/components/ui/button";
import { ExamType } from "@/app/generated/prisma/enums";
import { fetchLecturerUnits } from "@/app/lib/actions";
import { AlertCircle, FileSpreadsheet, Plus, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Unit = {
  id: number;
  name: string;
  code: string;
  year: string;
  totalStudents: number;
};

const examTypeOptions = Object.values(ExamType);

export default function UploadMarksPage() {
  const [file, setFile] = useState<File | null>(null);
  const [examType, setExamType] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [openSingle, setOpenSingle] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const units = await fetchLecturerUnits();
        setUnits(units?.unitDetails || []);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast.error("Failed to load units");
      }
    };
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !unitId) {
      toast.error("Please select a unit and an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("unitId", unitId);
    formData.append("examType", examType);

    try{
      setDisabled(true);
      toast.loading("Uploading marks...");
      const res = await fetch("/api/upload-marks", {
        method: "POST",
        body: formData,
      });
  
      toast.dismiss();
      const data = await res.json();
      if (res.ok || res.status == 200) {
        setFile(null);
        setUnitId("");
        setExamType("");
        console.log("Marks uploaded successfully", data);
        toast.success("Marks uploaded successfully");
      } else if (res.status == 400) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error uploading marks:", error);
      toast.error("Server error");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Upload Examination Marks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload marks using Excel or add a single missing mark.
          </p>
        </div>

        {/* SINGLE MARK BUTTON */}
        <Button
          variant="outline"
          onClick={() => setOpenSingle(true)}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Single Mark
        </Button>
      </div>

      {/* MAIN CARD */}
      <div className="rounded-2xl border bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 space-x-6 justify-between">
            {/* EXAMTYPE SELECTION */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) =>
                  setExamType(e.target.value as ExamType)
                }
                className="w-full bg-card rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Select exam type</option>

                {examTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* UNIT SELECTION */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Academic Unit
              </label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full bg-card rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Select unit</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.code} — {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Excel File
            </label>

            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 cursor-pointer hover:bg-muted transition"
            >
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />

              {file ? (
                <div className="text-sm text-center">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div className="text-center text-sm">
                  <p className="font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    .xlsx or .xls files only
                  </p>
                </div>
              )}

              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* EXCEL FORMAT NOTICE */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">
                Excel File Requirements
              </p>
              <ul className="list-disc ml-5 mt-1 text-destructive text-xs">
                <li>Columns must be named exactly: <b>regNo</b>, <b>examResult</b>, <b>catResult</b></li>
                <li>Exam marks should be out of 70</li>
                <li>CAT marks should be out of 30</li>
                <li>Students must be registered for this unit</li>
              </ul>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant={'outline'} 
              type="reset"
              onClick={() => {
                  setFile(null);
                  setUnitId("");
              }}
            >Reset</Button>

            <Button 
              onClick={handleSubmit}
              disabled={disabled}
              type="submit"
            ><Upload className="h-4 w-4" />
              Upload Marks
            </Button>
          </div>
        </form>
      </div>
      {/* SINGLE MARK DIALOG */}
      <SingleMarkDialog
        open={openSingle}
        onOpenChange={setOpenSingle}
        units={units}
        defaultUnitId={unitId}
      />
    </div>
  );
}
