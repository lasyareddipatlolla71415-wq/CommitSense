import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import AppShell from "@/components/AppShell";
import GoogleProvider from "@/components/GoogleProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChangeGuard - Safer Changes. Smarter Development.",
  description: "AI-powered insights to help you understand, debug, and safely modify any software project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <GoogleProvider>
            <AppShell>{children}</AppShell>
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
