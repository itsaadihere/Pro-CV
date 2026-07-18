'use client'

import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TemplatesPage() {
  // Mock templates list for display
  const templates = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    name: ['Minimalist Professional', 'Modern Tech', 'Executive Clean', 'Creative Standard', 'Classic Corporate', 'Academic CV'][i],
    type: ['ATS-Safe', 'Modern', 'ATS-Safe', 'Creative', 'ATS-Safe', 'Modern'][i],
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            49 Professional CV Templates
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your AI-rewritten CV is styled in one of 49 premium professional templates — modern, minimalist, ATS-safe. Every user gets a unique design.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <motion.div 
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all"
            >
              <div className="aspect-[1/1.4] bg-slate-100 flex items-center justify-center p-4 relative">
                {/* Visual placeholder for template */}
                <div className="w-full h-full bg-white shadow-sm border border-slate-200 p-4 rounded text-slate-300 flex flex-col gap-2 relative overflow-hidden">
                  <div className="h-4 w-1/2 bg-slate-200 rounded" />
                  <div className="h-2 w-1/3 bg-slate-200 rounded mb-4" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                  <div className="h-2 w-3/4 bg-slate-100 rounded mb-4" />
                  <div className="h-3 w-1/4 bg-slate-200 rounded mt-4" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                  <div className="h-2 w-5/6 bg-slate-100 rounded" />
                  
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-primary font-bold px-4 py-2 rounded-lg shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all">
                      Preview Style
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-900">{template.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {template.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center bg-primary-50 rounded-2xl p-8 border border-primary-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Want access to all 49 templates?</h2>
          <p className="text-slate-600 mb-6">Create your CV once, and export it in any style you like.</p>
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-800 transition-colors">
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
