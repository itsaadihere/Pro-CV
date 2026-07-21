import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { Safepay } from '@sfpy/node-sdk'

async function handleVerification(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let bodyParams: Record<string, string> = {}

    // Only try to parse body if it's a POST request and has content
    if (req.method === 'POST') {
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData: any = await req.formData()
        formData.forEach((value: any, key: string) => {
          bodyParams[key] = value.toString()
        })
      } else if (contentType.includes('application/json')) {
        try {
          bodyParams = await req.json()
        } catch (e) {
          console.error('Failed to parse JSON body', e)
        }
      }
    }

    const searchParams = req.nextUrl.searchParams
    
    // Safepay passes these in the POST body or GET query params
    const tracker = bodyParams.tracker || searchParams.get('tracker')
    const reference = bodyParams.reference || searchParams.get('reference')
    const sig = bodyParams.sig || searchParams.get('sig')

    // We passed these in the redirectUrl query string during initiate
    const email = searchParams.get('email') || bodyParams.email
    const orderRefNum = searchParams.get('orderRefNum') || bodyParams.orderRefNum || 'SP_REF_UNKNOWN'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    console.log('Safepay Verification Callback Payload:', { tracker, reference, email, orderRefNum, method: req.method })

    if (!email) {
      console.error('Payment succeeded but email is missing.')
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=User+session+lost`, appUrl),
        { status: 303 }
      )
    }

    if (!tracker || !sig) {
      console.error('Missing tracker or signature from Safepay callback.')
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=Invalid+Payment+Callback`, appUrl),
        { status: 303 }
      )
    }

    // Verify the Safepay Signature
    const environment = process.env.SAFEPAY_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    const safepay = new Safepay({
      environment: environment as any,
      apiKey: process.env.SAFEPAY_PUBLIC_KEY || '',
      v1Secret: process.env.SAFEPAY_SECRET_KEY || '',
      webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET || 'dummy-secret-for-sdk-to-work',
    })

    const isValid = safepay.verify.signature({ body: { tracker, sig } })

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

export async function POST(req: NextRequest) {
  return handleVerification(req)
}

export async function GET(req: NextRequest) {
  return handleVerification(req)
}

