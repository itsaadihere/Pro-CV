import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'

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
      bodyParams = await req.json()
    }

    console.log('EasyPaisa Verification Callback Mock Payload:', bodyParams)

    // Since it's a mock, we consider any request to this endpoint as success.
    // The email was passed in params during initiate
    const email = bodyParams.email
    const txnRefNo = bodyParams.orderRefNum || 'MOCK_REF'
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (!email) {
      console.error('Payment succeeded but email is missing from mock response.')
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=User+session+lost`, appUrl),
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
      console.error('Error finding profile in mock callback:', profileError)
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
      .eq('id', profile.id)

    if (updateError) {
      console.error('Error updating profile in mock callback:', updateError)
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
  } catch (error: any) {
    console.error('Error in /api/payment/verify callback:', error)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      new URL(`/payment/callback?status=failed&message=Internal+Server+Error`, appUrl),
      { status: 303 }
    )
  }
}
