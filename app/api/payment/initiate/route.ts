import { NextRequest, NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabase-server'
import crypto from 'crypto'

function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  )
}

function calculateSecureHash(params: Record<string, string>, salt: string): string {
  const sortedKeys = Object.keys(params).sort()
  const paramStrings = sortedKeys
    .filter((key) => params[key] !== undefined && params[key] !== '')
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  const hashString = `${salt}&${paramStrings}`
  return crypto
    .createHmac('sha256', salt)
    .update(hashString)
    .digest('hex')
    .toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getRouteSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 })
    }

    const email = session.user.email
    const userId = session.user.id

    const merchantId = process.env.JAZZCASH_MERCHANT_ID || 'placeholder_merchant_id'
    const password = process.env.JAZZCASH_PASSWORD || 'placeholder_password'
    const salt = process.env.JAZZCASH_INTEGRITY_SALT || 'placeholder_salt'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const txnRefNo = 'T' + Date.now().toString()
    const txnDateTime = formatDateTime(new Date())
    // 1 hour expiry
    const expiryDateTime = formatDateTime(new Date(Date.now() + 3600 * 1000))
    const billRef = 'B' + Date.now().toString().slice(-6)

    const params: Record<string, string> = {
      pp_Version: '2.0',
      pp_TxnType: 'MPAY',
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: '150000', // 1500 PKR in Paisas
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: billRef,
      pp_Description: 'ProCV AI CV Revamp - 1 Credit',
      pp_TxnExpiryDateTime: expiryDateTime,
      pp_ReturnURL: `${appUrl}/api/payment/verify`,
      ppmpf_1: email || '',
      ppmpf_2: userId,
    }

    const secureHash = calculateSecureHash(params, salt)
    params.pp_SecureHash = secureHash

    const postUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://jazzcash.com.pk/CustomerPortal/API/CheckOut' // Replace with live URL if different
        : 'https://sandbox.jazzcash.com.pk/CustomerPortal/API/CheckOut'

    return NextResponse.json({
      success: true,
      params,
      postUrl,
    })
  } catch (error: any) {
    console.error('Error in /api/payment/initiate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate transaction' },
      { status: 500 }
    )
  }
}
