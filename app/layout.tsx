import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import BetaBanner from "@/components/BetaBanner";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { organizationSchema } from '@/lib/schema';

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
  metadataBase: new URL('https://joinsophi.com'),
  title: {
    default: 'Sophi — AI CV Builder Pakistan | ATS-Optimized Resume in Minutes',
    template: '%s | Sophi — AI CV Builder'
  },
  description: 'Upload your CV, let advanced AI rewrite it into an ATS-optimized career document. Professional CV, cover letter & LinkedIn optimizer. Just 1500 PKR.',
  keywords: [
    'AI CV builder Pakistan', 'ATS resume builder', 'CV maker online Pakistan',
    'professional CV writer', 'ATS optimized resume', 'AI resume writer',
    'CV optimization', 'AI resume', 'JoinSophi', 'Sophi CV'
  ],
  authors: [{ name: 'Sophi', url: 'https://joinsophi.com' }],
  creator: 'Sophi',
  publisher: 'Sophi',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ur_PK'],
    url: 'https://joinsophi.com',
    siteName: 'Sophi',
    images: [{
      url: '/og/home.png',
      width: 1200,
      height: 630,
      alt: 'Sophi AI CV Builder — ATS-Optimized Resumes for Pakistani Professionals'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@JoinSophi',
    creator: '@JoinSophi'
  },
  alternates: {
    canonical: 'https://joinsophi.com'
  },
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_TOKEN',
    other: {
      'msvalidate.01': 'A26A4092BA4395B941A91E71E6180738' // CRITICAL for ChatGPT indexing
    }
  }
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
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <BetaBanner />
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <GoogleAnalytics gaId="G-8YEPSJ9MP3" />
      </body>
    </html>
  );
}
