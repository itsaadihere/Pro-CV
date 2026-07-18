'use client'

import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function LahoreCVBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-extrabold text-primary"
            >
              <span>🇵🇰 Specifically Optimized for Lahore Job Market</span>
            </motion.div>
            
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl leading-[1.1]">
              Professional AI CV Builder in Lahore
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Applying for jobs at software houses in Arfa Tech Park or corporate offices in Gulberg? Make sure your CV gets past their digital HR filters. Sophi uses AI to rewrite your CV specifically for Lahore's rapidly growing job market.
            </p>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Bypass local corporate ATS systems
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Optimize for IT, marketing, and corporate sectors
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Pay easily via JazzCash or Easypaisa
              </li>
            </ul>

            <div className="pt-4">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition-all shadow-lg">
                Revamp Your CV Now — 1500 PKR <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-gold-100 rounded-3xl transform -rotate-3" />
            <img 
              src="/images/cv_hero.png" 
              alt="Professional CV Builder Lahore" 
              className="relative rounded-3xl border border-white shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
