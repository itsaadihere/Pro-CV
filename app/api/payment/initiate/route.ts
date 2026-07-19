import { NextRequest, NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const supabase = getRouteSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 })
    }

    const email = session.user.email
    const userId = session.user.id

    // TODO: EasyPaisa Integration Details pending from user.
    // Mocking the EasyPaisa checkout flow for now.
    const storeId = process.env.EASYPAISA_STORE_ID || 'placeholder_store_id'
    const hashKey = process.env.EASYPAISA_HASH_KEY || 'placeholder_hash_key'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const orderRefNum = 'EP' + Date.now().toString()
    
    // EasyPaisa typical parameters (mocked)
    const params: Record<string, string> = {
      storeId: storeId,
      amount: '1500.0', // 1500 PKR
      postBackURL: `${appUrl}/api/payment/verify`,
      orderRefNum: orderRefNum,
      email: email || '',
      merchantHash: 'MOCK_HASH_FOR_NOW',
    }

    // Since we don't have the actual EasyPaisa production/sandbox URL or docs yet,
    // we'll point it to a mock checkout URL or the verify URL directly to simulate payment completion.
    // To allow the flow to continue in mock mode, we could point it directly to our verify URL with success=true
    const postUrl = `${appUrl}/api/payment/verify?orderRefNum=${orderRefNum}&mockSuccess=true`

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
