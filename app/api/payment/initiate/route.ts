import { NextRequest, NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabase-server'
import { Safepay } from '@sfpy/node-sdk'

export async function POST(req: NextRequest) {
  try {
    const supabase = getRouteSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 })
    }

    const email = session.user.email

    const environment = process.env.SAFEPAY_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
    const safepay = new Safepay({
      environment,
      apiKey: process.env.SAFEPAY_PUBLIC_KEY || '',
      v1Secret: process.env.SAFEPAY_SECRET_KEY || '',
      webhookSecret: '',
    })

    // Safepay expects amount in smallest unit (Paisa). 1500 PKR = 150000 Paisa.
    const amountInPaisa = 150000 
    const { token } = await safepay.payments.create({
      amount: amountInPaisa,
      currency: 'PKR',
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const orderRefNum = 'SP' + Date.now().toString()

    const checkoutUrl = safepay.checkout.create({
      token,
      orderId: orderRefNum,
      cancelUrl: `${appUrl}/payment/callback?status=failed`,
      // We pass the email and orderRefNum so we can credit the right user upon return
      redirectUrl: `${appUrl}/api/payment/verify?orderRefNum=${orderRefNum}&email=${encodeURIComponent(email || '')}`,
      source: 'custom',
      webhooks: false
    })

    return NextResponse.json({
      success: true,
      postUrl: checkoutUrl,
    })
  } catch (error: any) {
    console.error('Error in /api/payment/initiate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate transaction' },
      { status: 500 }
    )
  }
}
