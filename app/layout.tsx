import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import AuthContext from './context/AuthContext';
import ToasterContext from './context/ToasterContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'MMTS MMUST',
  description: 'Missing Marks Tracking System',
  icons: {
    icon: [
      {
        url: '/images/icon.png',
        href: '/images/icon.png',
      }
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthContext>
          <ToasterContext/>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster/>
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  )
}