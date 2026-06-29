import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import crypto from 'crypto'

function calculateSecureHash(params: Record<string, string>, salt: string): string {
  const sortedKeys = Object.keys(params).sort()
  const paramStrings = sortedKeys
    .filter((key) => key !== 'pp_SecureHash' && params[key] !== undefined && params[key] !== '')
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
    const contentType = req.headers.get('content-type') || ''
    let bodyParams: Record<string, string> = {}

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData()
      formData.forEach((value, key) => {
        bodyParams[key] = value.toString()
      })
    } else {
      // Fallback to JSON if any client posts JSON
      bodyParams = await req.json()
    }

    console.log('JazzCash Verification Callback Payload:', bodyParams)

    const responseCode = bodyParams.pp_ResponseCode
    const responseMessage = bodyParams.pp_ResponseMessage || 'Payment failed'
    const txnRefNo = bodyParams.pp_TxnRefNo || ''
    const userId = bodyParams.ppmpf_2 // We passed user ID in ppmpf_2
    const incomingHash = bodyParams.pp_SecureHash

    const salt = process.env.JAZZCASH_INTEGRITY_SALT || 'placeholder_salt'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Verify cryptographic signature to prevent spoofing
    if (incomingHash) {
      const calculatedHash = calculateSecureHash(bodyParams, salt)
      if (calculatedHash !== incomingHash.toUpperCase()) {
        console.error('Cryptographic signature mismatch! Hash validation failed.')
        return NextResponse.redirect(
          new URL(`/payment/callback?status=failed&message=Signature+validation+failed`, appUrl),
          { status: 303 } // Use 303 See Other for redirecting POST to GET
        )
      }
    } else {
      console.warn('No Secure Hash received in callback. Proceeding with caution (useful for test mocks).')
    }

    // Check payment success status
    if (responseCode === '000') {
      if (!userId) {
        console.error('Payment succeeded but user ID (ppmpf_2) is missing from response.')
        return NextResponse.redirect(
          new URL(`/payment/callback?status=failed&message=User+session+lost`, appUrl),
          { status: 303 }
        )
      }

      const supabase = getServiceSupabase()

      // Fetch user profile to add credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('cv_credits')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error finding profile in callback:', profileError)
        return NextResponse.redirect(
          new URL(`/payment/callback?status=failed&message=Profile+not+found`, appUrl),
          { status: 303 }
        )
      }

      // Add 1 credit, set has_paid = true, record payment reference
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          has_paid: true,
          cv_credits: (profile.cv_credits || 0) + 1,
          payment_ref: txnRefNo,
          paid_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating profile in callback:', updateError)
        return NextResponse.redirect(
          new URL(`/payment/callback?status=failed&message=Failed+to+unlock+credits`, appUrl),
          { status: 303 }
        )
      }

      // Redirect to success page
      return NextResponse.redirect(
        new URL(`/payment/callback?status=success&ref=${txnRefNo}`, appUrl),
        { status: 303 }
      )
    } else {
      // Payment failed
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=${encodeURIComponent(responseMessage)}`, appUrl),
        { status: 303 }
      )
    }
  } catch (error: any) {
    console.error('Error in /api/payment/verify callback:', error)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      new URL(`/payment/callback?status=failed&message=Internal+Server+Error`, appUrl),
      { status: 303 }
    )
  }
}
