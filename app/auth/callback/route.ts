import { getRouteSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const supabase = getRouteSupabase()
      await supabase.auth.exchangeCodeForSession(code)
    }

    // Redirect to dashboard after successful exchange
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Error in auth callback code exchange:', error)
    // Return to root on error
    return NextResponse.redirect(new URL('/', request.url))
  }
}
