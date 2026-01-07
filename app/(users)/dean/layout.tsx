import { DashboardNav } from "@/app/components/DashboardNav";
import { UserNav } from "@/app/components/user-nav";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/utils/authOptions";
import { redirect } from "next/navigation";

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
      redirect('/student/home');
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
    <div className="min-h-screen flex">
      <DashboardNav />
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
    </ThemeProvider>
    </>
  );
}