"use client";

import { cn } from '@/app/lib/utils';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  FileSpreadsheet,
  GraduationCapIcon,
  XIcon,
  MenuIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from 'react';

const routes = {
  ADMIN: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Schools",
      icon: School,
      href: "/admin/schools",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Programs",
      icon: GraduationCapIcon,
      href: "/admin/programs",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/admin/courses",
    },
  ],
  DEAN: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dean",
    },
    {
      title: "Lecturers",
      icon: Users,
      href: "/dean/lecturers",
    },
    {
      title: "Students",
      icon: GraduationCapIcon,
      href: "/dean/students",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/dean/courses",
    },
    {
      title: "Missing Marks",
      icon: FileSpreadsheet,
      href: "/dean/missing-marks",
    },
  ],
  COD: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/cod",
    },
    {
      title: "Lecturers",
      icon: Users,
      href: "/cod/lecturers",
    },
    {
      title: "Students",
      icon: GraduationCapIcon,
      href: "/cod/students",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/cod/courses",
    },
    {
      title: "Missing Marks",
      icon: FileSpreadsheet,
      href: "/cod/missing-marks",
    },
  ],
  LECTURER: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/lecturer",
    },
    {
      title: "Upload Marks",
      icon: BookOpen,
      href: "/lecturer/upload-marks",
    },
    {
      title: "My Courses",
      icon: BookOpen,
      href: "/lecturer/courses",
    },
    {
      title: "Missing Marks",
      icon: FileSpreadsheet,
      href: "/lecturer/missing-marks",
    },
  ],
  STUDENT: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/student",
    },
    {
      title: "My Courses",
      icon: BookOpen,
      href: "/student/courses",
    },
    {
      title: "My Missing Mark",
      icon: FileSpreadsheet,
      href: "/student/reported",
    },
    {
      title: "My Suspended Marks",
      icon: FileSpreadsheet,
      href: "/student/suspended-marks",
    },
    {
      title: "Help",
      icon: QuestionMarkCircleIcon,
      href: "/student/help",
    },
  ],
};

type Variant = "mobile" | "sidebar";

interface DashboardNavProps {
  variant?: Variant;
}

export function DashboardNav({ variant }: DashboardNavProps = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  // This should be dynamic based on user role from auth context
  const userRole = pathname.includes("/admin")
    ? "ADMIN"
    : pathname.includes("/dean")
    ? "DEAN"
    : pathname.includes("/cod")
    ? "COD"
    : pathname.includes("/lecturer")
    ? "LECTURER"
    : "STUDENT";

  const currentRoutes = routes[userRole as keyof typeof routes];

  if (variant === "sidebar") {
    return (
      <nav className="hidden md:block w-64 border-r bg-card min-h-screen p-4 space-y-4">
        
        <div className="space-y-1">
          {currentRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  /* ---------------- MOBILE NAV (HEADER + DRAWER) ---------------- */
  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-muted"
        aria-label="Open menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold">Missing Marks System</span>
          </div>
          <button onClick={() => setOpen(false)}>
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {currentRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}