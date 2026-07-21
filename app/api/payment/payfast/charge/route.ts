import { NextResponse } from 'next/server';
import { getAccessToken, processTransaction } from '@/lib/payfast';
import { getRouteSupabase } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const supabase = getRouteSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const auth = await getAccessToken(ip);
    
    const res = await processTransaction(auth.token, { ...data, ip });
    
    // "00" is Processed OK for Payfast
    if (res.code === "00" || res.status_code === "00") {
       const { data: profile } = await supabase.from('profiles').select('id, cv_credits').eq('id', session.user.id).single();
       if (profile) {
          await supabase.from('profiles').update({
             has_paid: true,
             cv_credits: (profile.cv_credits || 0) + 1,
             payment_ref: res.transaction_id,
             paid_at: new Date().toISOString()
          }).eq('id', profile.id);
       }
    } else {
       return NextResponse.json({ error: res.status_msg || res.message || 'Transaction Failed' }, { status: 400 });
    }
    
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
