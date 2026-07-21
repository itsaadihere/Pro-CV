import { NextResponse } from 'next/server';
import { getAccessToken, getBanks } from '@/lib/payfast';

export async function GET(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const auth = await getAccessToken(ip);
    const banksRes = await getBanks(auth.token, ip);
    return NextResponse.json(banksRes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
