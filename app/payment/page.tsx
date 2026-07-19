'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import { CreditCard, ShieldCheck, Loader2, ArrowLeft, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { isBetaActive } from '@/lib/beta'

export default function PaymentPage() {
  const router = useRouter()
  const supabase = getClientSupabase()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expired. Please log in again.')
        router.push('/login')
        return
      }
      if (isBetaActive()) {
        router.push('/upload')
        return
      }
      setEmail(session.user.email || '')
      setLoading(false)
    }

    checkSession()
  }, [supabase, router])


  const handlePayment = async () => {
    setPaying(true)
    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate transaction.')
      }

      // Create a form programmatically and submit it to the gateway
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.postUrl

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (error: any) {
      toast.error(error.message || 'Payment initiation failed. Please try again.')
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-slate-500">Preparing checkout portal...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
            Payment Summary
          </h2>

          {/* Pricing Box */}
          <div className="mt-6 rounded-xl bg-slate-50 p-5 border border-slate-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Sophi CV Revamp Credit</h3>
                <p className="text-xs text-slate-500 mt-1">Unlock 1 AI CV transformation & ATS review</p>
              </div>
              <span className="text-lg font-black text-slate-900">1,500 PKR</span>
            </div>
            
            <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Account Email</span>
              <span className="text-slate-900">{email}</span>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">What is included:</h4>
            <div className="grid gap-2 text-sm text-slate-655 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold">✓</span>
                <span>Complete CV rewrites by Kimi AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold">✓</span>
                <span>ATS Optimization (5 grading points)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold">✓</span>
                <span>LinkedIn Headline & Profile Bio Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold">✓</span>
                <span>Professional JD-Tailored Cover Letter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold">✓</span>
                <span>PDF export in 3 designs (ATS-Safe, Modern, Minimalist)</span>
              </div>
            </div>
          </div>

          {/* Checkout Buttons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handlePayment}
              disabled={paying}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-850 disabled:bg-primary-350 hover:shadow-lg hover:shadow-primary-100"
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Contacting EasyPaisa...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span>Pay with EasyPaisa</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Secure transaction processed by EasyPaisa Merchant Gateway</span>
            </div>
          </div>
        </div>

        {/* FAQ Support */}
        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>Need help? Contact support on WhatsApp at +92-XXX-XXXXXXX</span>
        </div>
      </div>
    </div>
  )
}
