'use client'

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ShieldAlert, XCircle, Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ATSCheckerPage() {
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScan = () => {
    if (text.length < 50) return;
    setIsScanning(true);
    setScanComplete(false);
    setProgress(0);
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setScanComplete(true);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Free ATS Score Checker
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste your CV text below to see how applicant tracking systems score your resume. Find out why you might be getting filtered out before a human even reads your application.
          </p>
        </div>

        {!scanComplete && !isScanning && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200"
          >
            <label htmlFor="cvText" className="block text-sm font-bold text-slate-700 mb-2">
              Paste your CV content here (text only)
            </label>
            <textarea
              id="cvText"
              className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              placeholder="Experience: Software Engineer at Tech Corp..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-6 flex justify-between items-center">
              <span className="text-xs text-slate-500">Requires at least 50 characters.</span>
              <button 
                onClick={handleScan}
                disabled={text.length < 50}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Scan My CV Now
              </button>
            </div>
          </motion.div>
        )}

        {isScanning && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
            <div className="w-24 h-24 mx-auto border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
            <h3 className="text-xl font-bold text-slate-800">Analyzing your CV against 5 ATS dimensions...</h3>
            <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 animate-pulse">
              Checking keyword density, semantic relevance, action verbs, and structural compliance...
            </p>
          </div>
        )}

        {scanComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid gap-8 md:grid-cols-12"
          >
            <div className="md:col-span-5 bg-white p-8 rounded-2xl shadow-sm border border-red-200 flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Your Estimated ATS Score</h2>
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#fee2e2" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="10" strokeDasharray={`${34 * 2.82} 300`} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-red-500">34<span className="text-2xl text-slate-400">/100</span></span>
                  <span className="text-xs font-bold text-red-600 uppercase mt-1">High Risk</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                CVs below 70 are typically auto-rejected by recruitment software before a human sees them.
              </p>
            </div>

            <div className="md:col-span-7 space-y-6">
              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-red-800 font-bold mb-4">
                  <ShieldAlert className="w-5 h-5" /> Critical Issues Found
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-slate-800 text-sm">Low Keyword Density</span>
                      <span className="text-xs text-slate-600">Missing standard industry terminology required by HR filters.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-slate-800 text-sm">Weak Action Verbs</span>
                      <span className="text-xs text-slate-600">Bullets lack STAR-metric quantifiable achievements.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-slate-800 text-sm">Unoptimized Formatting</span>
                      <span className="text-xs text-slate-600">ATS bots may fail to parse sections properly.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-xl font-bold mb-2">Fix Your CV Instantly</h3>
                <p className="text-sm text-primary-100 mb-6">
                  Don't let algorithms reject your application. Let Sophi's AI completely rewrite and optimize your CV to score 90+ on ATS tests.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/login" className="w-full sm:w-auto px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-colors text-center">
                    Optimize for 1500 PKR
                  </Link>
                  <span className="text-xs font-medium text-primary-200 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Results in 60 seconds
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
