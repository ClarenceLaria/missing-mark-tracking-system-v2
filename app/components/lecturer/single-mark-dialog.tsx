"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Unit = {
  id: number;
  name: string;
  code: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: Unit[];
  defaultUnitId?: string;
}

export default function SingleMarkDialog({
  open,
  onOpenChange,
  units,
  defaultUnitId,
}: Props) {
  const [unitId, setUnitId] = useState("");
  const [regNo, setRegNo] = useState("");
  const [cat, setCat] = useState("");
  const [exam, setExam] = useState("");

  useEffect(() => {
    if (defaultUnitId) setUnitId(defaultUnitId);
  }, [defaultUnitId]);

  const handleSubmit = async () => {
    if (!unitId || !regNo || !cat || !exam) {
      toast.error("All fields are required");
      return;
    }

    if (Number(cat) > 30 || Number(exam) > 70) {
      toast.error("Invalid marks entered");
      return;
    }

    try {
      toast.loading("Uploading mark...");

      const res = await fetch("/api/upload-single-mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitId,
          regNo,
          cat: Number(cat),
          exam: Number(exam),
        }),
      });

      toast.dismiss();
      const data = await res.json();

      if (res.ok) {
        toast.success("Mark uploaded successfully");

        // reset
        setRegNo("");
        setCat("");
        setExam("");

        onOpenChange(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Internal server error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Single Mark</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Unit */}
          <div>
            <label className="text-sm font-medium">Unit</label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.code} — {unit.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reg No */}
          <div>
            <label className="text-sm font-medium">Student Reg No</label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">CAT (/30)</label>
              <input
                type="number"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Exam (/70)</label>
              <input
                type="number"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit}>
            Submit Mark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}