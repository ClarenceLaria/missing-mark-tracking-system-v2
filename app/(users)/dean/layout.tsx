import { DashboardNav } from "@/app/components/DashboardNav";
import { UserNav } from "@/app/components/user-nav";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/utils/authOptions";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session){
      redirect('/')
    }
    const userType =session?.userType;
    if (userType === 'STUDENT') {
      redirect('/student');
    } else if (userType === 'LECTURER') {
      redirect('/lecturer');
    } else if (userType === 'COD') {
      redirect('/cod');
    } else if (userType === 'ADMIN') {
      redirect('/admin');
    } else if (userType === 'SUPERADMIN') {
      redirect('/superadmin');
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