'use client'

import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { CheckCircle, Upload, ArrowDownToLine, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            How Sophi Transforms Your CV in 3 Simple Steps
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See exactly how Sophi transforms your old CV into an ATS-optimized career document using advanced AI.
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-shrink-0 w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Zap className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 1 — Pay 1500 PKR via Safepay</h2>
              <p className="text-slate-600 mb-4">
                Complete a one-time payment of 1500 PKR securely using Safepay. Your account is instantly unlocked after payment confirmation.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <CheckCircle className="w-5 h-5" /> Instant Activation
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-shrink-0 w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <Upload className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 2 — Upload Your Existing CV (PDF or DOCX)</h2>
              <p className="text-slate-600 mb-4">
                Upload your current CV in PDF or DOCX format. Select your target industry, paste an optional job description, and choose your preferred language.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <CheckCircle className="w-5 h-5" /> Secure & Private
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-shrink-0 w-24 h-24 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center">
              <ArrowDownToLine className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 3 — Download Your AI-Rewritten ATS-Optimized CV</h2>
              <p className="text-slate-600 mb-4">
                In under 60 seconds, receive your ATS-optimized CV, LinkedIn optimizer, cover letter, and gap analysis. Download as PDF or receive via email.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <CheckCircle className="w-5 h-5" /> 49 Templates Available
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary rounded-xl hover:bg-primary-800 transition-colors shadow-lg">
            Start Your CV Transformation
          </Link>
        </div>
      </main>
    </div>
  );
}
