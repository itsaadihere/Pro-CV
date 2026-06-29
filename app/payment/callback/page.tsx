'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { CheckCircle2, XCircle, CreditCard, ArrowRight, RefreshCw, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

function PaymentCallbackInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading')
  const [refNo, setRefNo] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const paymentStatus = searchParams.get('status')
    const paymentRef = searchParams.get('ref')
    const paymentMessage = searchParams.get('message')

    if (paymentStatus === 'success') {
      setStatus('success')
      setRefNo(paymentRef || 'N/A')
      toast.success('Payment completed successfully!')
    } else if (paymentStatus === 'failed') {
      setStatus('failed')
      setErrorMsg(paymentMessage || 'Transaction was canceled or declined.')
      toast.error('Payment failed.')
    } else {
      // If accessed directly without parameters, redirect back to dashboard
      router.push('/dashboard')
    }
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Verifying transaction details...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md text-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {status === 'success' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Success Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Thank you for choosing ProCV. Your payment was verified, and your CV revamp slot has been unlocked.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Product</span>
                <span className="text-slate-900">1x AI CV Revamp Slot</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid</span>
                <span className="text-slate-900">1,500.00 PKR</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span>Transaction Ref</span>
                <span className="font-mono text-slate-900">{refNo}</span>
              </div>
            </div>

            <div>
              <Link
                href="/upload"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-100"
              >
                <span>Proceed to CV Upload</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Failure Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm">
              <XCircle className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Transaction Failed</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We could not complete your payment. The gateway returned the following error message:
              </p>
            </div>

            {/* Error Message Box */}
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-sm font-semibold text-red-900">
              {errorMsg}
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/payment"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Payment</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Return to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Verifying transaction details...</p>
      </div>
    }>
      <PaymentCallbackInner />
    </Suspense>
  )
}

