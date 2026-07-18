'use client'

import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Check, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Sophi Pricing
          </h1>
          <p className="text-lg text-slate-600">
            Get a complete AI-powered CV transformation for just 1500 PKR. Includes ATS-optimized resume, LinkedIn optimizer, cover letter, gap analysis, PDF export. No hidden fees.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-primary-100 overflow-hidden"
          >
            <div className="bg-primary p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Complete CV Package</h2>
              <div className="flex justify-center items-end gap-2 mt-4">
                <span className="text-5xl font-black">1500</span>
                <span className="text-xl font-medium mb-1">PKR</span>
              </div>
              <p className="text-primary-100 mt-2 text-sm">One-time payment per CV</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4 mb-8">
                {[
                  "Kimi AI Revamped CV (ATS-optimized)",
                  "ATS keyword scoring and formatting audit",
                  "LinkedIn headline and bio optimization tags",
                  "Job Description targeted Cover Letter",
                  "Gap Analysis with Quick Wins",
                  "49 Professional CV Templates export",
                  "Direct email dispatch"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <Link href="/login" className="block w-full py-4 px-6 text-center text-white bg-primary font-bold rounded-xl hover:bg-primary-800 transition-colors">
                  Pay via JazzCash / Easypaisa
                </Link>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Shield className="w-4 h-4" /> Secure checkout process
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
