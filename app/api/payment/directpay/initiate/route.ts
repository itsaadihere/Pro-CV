import { NextRequest, NextResponse } from 'next/server';
import { getRouteSupabase } from '@/lib/supabase-server';
import { generateDirectPayUrl } from '@/lib/directpay';

export async function POST(req: NextRequest) {
  try {
    const supabase = getRouteSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    const body = await req.json();
    const { payerName, msisdn } = body;

    if (!payerName || typeof payerName !== 'string' || !payerName.trim()) {
      return NextResponse.json({ error: 'Customer full name is required.' }, { status: 400 });
    }

    const cleanMsisdn = (msisdn || '').replace(/[\s-]/g, '');
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(cleanMsisdn)) {
      return NextResponse.json({
        error: 'Invalid mobile number format. Must be 11 digits starting with 03 (e.g., 03001234567).'
      }, { status: 400 });
    }

    const email = user.email;
    if (!email) {
      return NextResponse.json({ error: 'User email is required.' }, { status: 400 });
    }

    // Generate unique client transaction ID (max 50 chars, alphanumeric with dashes)
    const clientTransactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const successRedirectUrl = `${appUrl}/api/payment/directpay/verify?status=success&txn=${clientTransactionId}&email=${encodeURIComponent(email)}`;
    const failedRedirectUrl = `${appUrl}/payment/callback?status=failed&message=${encodeURIComponent('Payment was cancelled or failed.')}`;

    const paymentUrl = generateDirectPayUrl({
      clientTransactionId,
      amountInPKR: 1500,
      description: 'Sophi CV Revamp Credit',
      payerName: payerName.trim(),
      email,
      msisdn: cleanMsisdn,
      currency: 'PKR',
      successRedirectUrl,
      failedRedirectUrl,
    });

    return NextResponse.json({
      success: true,
      url: paymentUrl,
      clientTransactionId,
    });
  } catch (error: any) {
    console.error('Error initiating DirectPay payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
