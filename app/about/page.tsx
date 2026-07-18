'use client'

import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              About Sophi
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We built Sophi because we saw Pakistani professionals getting filtered out by ATS software that never even read their CVs.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg prose-slate mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200"
          >
            <h2>The ATS Problem</h2>
            <p>
              In 2026, 98% of large companies and recruiters use Applicant Tracking Systems (ATS) to filter CVs before a human ever looks at them. Most brilliant professionals from Pakistan, UAE, and Saudi Arabia face instant rejection because their CVs aren't properly formatted for these algorithms.
            </p>
            
            <h2>Our Solution</h2>
            <p>
              Sophi is an AI-powered CV transformation engine tailored specifically for the Pakistani and Gulf job markets. Using advanced AI, we reverse-engineer the ATS screening process. Our engine rewrites your existing CV with precise keyword density, STAR-metric achievement bullets, and semantic relevance to ensure you bypass digital filters.
            </p>

            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 my-8">
              <h3 className="text-primary-800 mt-0">Our Mission</h3>
              <p className="mb-0 text-primary-900 font-medium">
                To level the playing field for Pakistani professionals by providing world-class, AI-driven career tools that guarantee their applications get seen by human recruiters.
              </p>
            </div>

            <h2>Why 1500 PKR?</h2>
            <p>
              Traditional CV writing services charge between 10,000 to 25,000 PKR, taking weeks to deliver. By leveraging advanced LLMs, we provide superior quality, data-driven optimization in under 60 seconds — making top-tier career advancement accessible to everyone.
            </p>

            <hr className="my-8" />

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-400">
                S
              </div>
              <div>
                <h4 className="m-0 font-bold text-slate-900">The Sophi Team</h4>
                <p className="m-0 text-sm text-slate-500">Karachi, Pakistan</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
