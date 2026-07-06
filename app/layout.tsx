import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import BetaBanner from "@/components/BetaBanner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sophi — AI-Powered ATS CV Builder & Transformation Engine",
  description: "Pay 1500 PKR, upload your CV (PDF or Word), and receive an optimized, AI-generated CV, cover letter, LinkedIn profile hooks, and semantic gap analysis in 60 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-800 bg-slate-50`}
      >
        <BetaBanner />
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}


