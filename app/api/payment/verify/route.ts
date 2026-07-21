import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { Safepay } from '@sfpy/node-sdk'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let bodyParams: Record<string, string> = {}

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData: any = await req.formData()
      formData.forEach((value: any, key: string) => {
        bodyParams[key] = value.toString()
      })
    } else {
      bodyParams = await req.json()
    }

    // Safepay passes these in the POST body
    const tracker = bodyParams.tracker
    const reference = bodyParams.reference
    const sig = bodyParams.sig

    // We passed these in the redirectUrl query string during initiate
    const searchParams = req.nextUrl.searchParams
    const email = searchParams.get('email')
    const orderRefNum = searchParams.get('orderRefNum') || 'SP_REF_UNKNOWN'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    console.log('Safepay Verification Callback Payload:', { bodyParams, email, orderRefNum })

    if (!email) {
      console.error('Payment succeeded but email is missing from query params.')
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=User+session+lost`, appUrl),
        { status: 303 }
      )
    }

    // Verify the Safepay Signature
    const environment = process.env.SAFEPAY_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    const safepay = new Safepay({
      environment,
      apiKey: process.env.SAFEPAY_PUBLIC_KEY || '',
      v1Secret: process.env.SAFEPAY_SECRET_KEY || '',
      webhookSecret: '',
    })

    const isValid = safepay.verify.signature(tracker, sig)

    if (!isValid) {
      console.error('Safepay signature verification failed!')
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=Invalid+Payment+Signature`, appUrl),
        { status: 303 }
      )
    }

    const supabase = getServiceSupabase()

    // Fetch user profile to add credits based on email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, cv_credits')
      .eq('email', email)
      .single()

    if (profileError || !profile) {
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
        payment_ref: reference || orderRefNum,
        paid_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (updateError) {
      console.error('Error updating profile in callback:', updateError)
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=Failed+to+unlock+credits`, appUrl),
        { status: 303 }
      )
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/payment/callback?status=success&ref=${reference || orderRefNum}`, appUrl),
      { status: 303 }
    )
  } catch (error: any) {
    console.error('Error in /api/payment/verify callback:', error)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      new URL(`/payment/callback?status=failed&message=Internal+Server+Error`, appUrl),
      { status: 303 }
    )
  }
}

