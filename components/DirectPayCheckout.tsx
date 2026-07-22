'use client'

import { useState } from 'react'
import { Loader2, ShieldCheck, CreditCard, Phone, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface DirectPayCheckoutProps {
  email: string
  defaultName?: string
}

export default function DirectPayCheckout({ email, defaultName = '' }: DirectPayCheckoutProps) {
  const [payerName, setPayerName] = useState(defaultName)
  const [msisdn, setMsisdn] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!payerName.trim()) {
      toast.error('Please enter your full name.')
      return
    }

    const cleanMsisdn = msisdn.replace(/[\s-]/g, '')
    if (!/^03\d{9}$/.test(cleanMsisdn)) {
      toast.error('Please enter a valid 11-digit mobile number starting with 03 (e.g. 03001234567).')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/payment/directpay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerName: payerName.trim(),
          msisdn: cleanMsisdn,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Failed to initiate DirectPay transaction.')
      }

      toast.loading('Redirecting to DirectPay payment portal...')
      window.location.href = data.url
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-150 text-blue-900 text-xs font-semibold">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          DirectPay Gateway (JazzCash, EasyPaisa, Cards & Bank Accounts)
        </span>
        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono uppercase font-bold">Secure PWA</span>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              required
              type="text"
              placeholder="e.g. Muhammad Ali"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              className="rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 w-full outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mobile Number (11 digits starting with 03) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              required
              type="tel"
              placeholder="03001234567"
              maxLength={11}
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              className="rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 w-full outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-850 disabled:opacity-50 shadow-md hover:shadow-lg hover:shadow-primary-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            <span>Connecting to DirectPay...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 text-gold" />
            <span>Pay with DirectPay (1,500 PKR)</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Encrypted 256-bit payment transaction via DirectPay</span>
      </div>
    </form>
  )
}
