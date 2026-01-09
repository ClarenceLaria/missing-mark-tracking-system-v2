import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/utils/authOptions";
import { ThemeProvider } from "../../components/ThemeProvider";
import { Toaster } from "../../components/ui/toaster";
import { UserNav } from "../../components/user-nav";
import { ThemeToggle } from "../../components/ThemeToggle";
import { DashboardNav } from "../../components/DashboardNav";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "MMUST Missing Marks System",
  description: "A comprehensive system for tracking, reporting, and managing missing marks at Masinde Muliro University of Science and Technology (MMUST). Facilitates efficient communication and resolution for academic records.",
};

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session){
    redirect('/')
  }
  const userType =session?.userType
  if (userType === 'STUDENT') {
    redirect('/student/home');
  } else if (userType === 'LECTURER') {
    redirect('/lecturer');
  } else if (userType === 'COD') {
    redirect('/cod');
  } else if (userType === 'DEAN'){
    redirect('/dean');
  } else if (userType === 'SUPERADMIN') {
    redirect('/superAdmin');
  }
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
      <div className="min-h-screen flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-16 border-b flex items-center px-4">
          <div className="hidden md:flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold">Missing Mark System</span>
          </div>
          <DashboardNav />   {/* menu button + drawer only */}
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-64 border-r bg-card">
            <DashboardNav variant="sidebar" />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>

      </div>
    </ThemeProvider>
    </>
  );
}
