'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Bank {
  bank_code: string;
  name: string;
}

export default function PayfastCheckout({ email }: { email: string }) {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) 
  
  const [mobile, setMobile] = useState('')
  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [cnic, setCnic] = useState('')
  const [otp, setOtp] = useState('')
  
  const [transactionId, setTransactionId] = useState('')
  const [basketId, setBasketId] = useState('')
  const [orderDate, setOrderDate] = useState('')

  useEffect(() => {
    async function fetchBanks() {
      try {
        const res = await fetch('/api/payment/payfast/banks')
        const data = await res.json()
        if (data.banks) {
          setBanks(data.banks)
        }
      } catch (err) {
        console.error('Failed to load banks', err)
      }
    }
    fetchBanks()
  }, [])

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        txnamt: '1500',
        customer_mobile_no: mobile,
        customer_email_address: email,
        bank_code: bankCode,
        account_number: accountNumber,
        cnic_number: cnic,
      }
      const res = await fetch('/api/payment/payfast/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      
      if (data.error || (data.code && data.code !== "00")) {
        throw new Error(data.error || data.message || 'Validation failed')
      }
      
      setTransactionId(data.transaction_id)
      setBasketId(data.basket_id)
      setOrderDate(data.order_date)
      setStep(2)
      toast.success('OTP sent to your mobile!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCharge = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        basket_id: basketId,
        txnamt: '1500',
        customer_mobile_no: mobile,
        customer_email_address: email,
        bank_code: bankCode,
        account_number: accountNumber,
        cnic_number: cnic,
        order_date: orderDate,
        otp: otp,
        transaction_id: transactionId,
      }
      const res = await fetch('/api/payment/payfast/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      window.location.href = `/payment/callback?status=success&ref=${data.transaction_id || data.basket_id}`
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <form onSubmit={handleValidate} className="space-y-4">
        <div className="grid gap-3 text-sm">
          <input required type="text" placeholder="Mobile (e.g. 92-345XXXXXX)" value={mobile} onChange={e => setMobile(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 w-full outline-none focus:border-[#F7941D]" />
          <select required value={bankCode} onChange={e => setBankCode(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 w-full bg-white outline-none focus:border-[#F7941D]">
            <option value="">Select Bank</option>
            {/* If banks array is empty, fallback to demo bank for testing */}
            {banks.length === 0 && <option value="demo">Demo Bank</option>}
            {banks.map(b => (
              <option key={b.bank_code} value={b.bank_code}>{b.name}</option>
            ))}
          </select>
          <input required type="text" placeholder="Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 w-full outline-none focus:border-[#F7941D]" />
          <input required type="text" placeholder="CNIC Number" value={cnic} onChange={e => setCnic(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 w-full outline-none focus:border-[#F7941D]" />
        </div>
        <button type="submit" disabled={loading} className="flex w-full justify-center items-center gap-2 rounded-xl bg-[#F7941D] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#e68a1b] disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Verify Account (PayFast)</span>}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleCharge} className="space-y-4">
      <div className="text-sm text-slate-600 mb-2 font-medium">Please enter the OTP sent to your mobile.</div>
      <input required type="text" placeholder="Enter OTP (Test: 123456)" value={otp} onChange={e => setOtp(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 w-full outline-none focus:border-[#F7941D]" />
      <button type="submit" disabled={loading} className="flex w-full justify-center items-center gap-2 rounded-xl bg-[#F7941D] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#e68a1b] disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Confirm Payment (1,500 PKR)</span>}
      </button>
    </form>
  )
}
