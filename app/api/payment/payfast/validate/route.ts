import { NextResponse } from 'next/server';
import { getAccessToken, validateCustomer } from '@/lib/payfast';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const auth = await getAccessToken(ip);
    
    // Auto-generate basket ID and order date for this step
    const basket_id = 'PF' + Date.now();
    const order_date = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const res = await validateCustomer(auth.token, { 
      ...data, 
      ip, 
      basket_id, 
      order_date 
    });

    // Return the generated basket_id and order_date back to the client
    // so they can be passed to the final transaction API call
    return NextResponse.json({
        ...res,
        basket_id,
        order_date
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
