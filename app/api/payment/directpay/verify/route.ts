import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-server';

async function handleVerification(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const txn = searchParams.get('txn') || searchParams.get('client_transaction_id') || 'DP_TXN_UNKNOWN';
    const email = searchParams.get('email');

    console.log('DirectPay Verification Callback Payload:', { status, txn, email });

    if (status === 'failed' || status === 'cancel') {
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=${encodeURIComponent('Payment was cancelled or declined.')}`, appUrl),
        { status: 303 }
      );
    }

    if (!email) {
      console.error('DirectPay verification failed: User email missing from callback URL.');
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=${encodeURIComponent('User session verification failed.')}`, appUrl),
        { status: 303 }
      );
    }

    const supabase = getServiceSupabase();

    // Fetch user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, cv_credits')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      console.error('Error finding user profile during DirectPay verification:', profileError);
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=${encodeURIComponent('User profile not found.')}`, appUrl),
        { status: 303 }
      );
    }

    // Unlock credit for user
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        has_paid: true,
        cv_credits: (profile.cv_credits || 0) + 1,
        payment_ref: txn,
        paid_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Error updating profile credits during DirectPay verification:', updateError);
      return NextResponse.redirect(
        new URL(`/payment/callback?status=failed&message=${encodeURIComponent('Failed to unlock CV credit.')}`, appUrl),
        { status: 303 }
      );
    }

    // Successfully verified & credited! Redirect to success page
    return NextResponse.redirect(
      new URL(`/payment/callback?status=success&ref=${encodeURIComponent(txn)}`, appUrl),
      { status: 303 }
    );
  } catch (error: any) {
    console.error('Error in /api/payment/directpay/verify callback:', error);
    return NextResponse.redirect(
      new URL(`/payment/callback?status=failed&message=${encodeURIComponent('Internal server error during verification.')}`, appUrl),
      { status: 303 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleVerification(req);
}

export async function POST(req: NextRequest) {
  return handleVerification(req);
}
