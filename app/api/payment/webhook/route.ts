import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // We currently process payments via the redirect callback in /api/payment/verify.
  // This webhook endpoint is a placeholder to satisfy Safepay dashboard requirements
  // and will return a 200 OK to acknowledge receipt of any background events.
  return NextResponse.json({ received: true })
}
