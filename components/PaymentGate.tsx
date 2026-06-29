'use client'

import React from 'react'
import Link from 'next/link'
import { Lock, CreditCard, ChevronRight } from 'lucide-react'
import { isBetaActive } from '@/lib/beta'

interface PaymentGateProps {
  credits: number | null
  loading: boolean
  children: React.ReactNode
}

export default function PaymentGate({ credits, loading, children }: PaymentGateProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Checking your account credits...</p>
      </div>
    )
  }

  if (isBetaActive()) {
    return <>{children}</>
  }

  if (credits === null || credits <= 0) {

    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/20 to-white p-8 shadow-sm md:p-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            CV Transformation Lock
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            You do not have any active transformation credits. Unlock Kimi AI powered revamp, 
            ATS keyword score card, LinkedIn summary optimization, cover letter, and gap analysis for just 1500 PKR.
          </p>

          <div className="mt-8 grid gap-4 w-full sm:grid-cols-2 text-left">
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <span className="block text-xs font-bold text-slate-400 uppercase">Includes</span>
              <span className="mt-1 block text-lg font-bold text-slate-800">1 Full Revamp</span>
              <span className="block text-xs text-slate-500 mt-0.5">ATS compliance + 3 layout exports</span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <span className="block text-xs font-bold text-slate-400 uppercase">Cost</span>
              <span className="mt-1 block text-lg font-bold text-slate-800">1,500 PKR</span>
              <span className="block text-xs text-slate-500 mt-0.5">Secure JazzCash / Easypaisa payment</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              href="/payment"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-100"
            >
              <CreditCard className="h-4 w-4" />
              <span>Purchase credit slot</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Return to dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
