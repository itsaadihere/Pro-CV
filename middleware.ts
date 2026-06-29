import { getMiddlewareSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isBetaActive } from '@/lib/beta'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = getMiddlewareSupabase(req, res)
  
  // Refresh session if expired - required for Server Components & Route Handlers
  const { data: { session } } = await supabase.auth.getSession()

  const protectedRoutes = ['/upload', '/dashboard', '/result']
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Payment check — SKIPPED entirely in beta mode
  if (!isBetaActive() && session && req.nextUrl.pathname.startsWith('/upload')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_paid, cv_credits')
      .eq('id', session.user.id)
      .single()

    if (!profile?.has_paid && (profile?.cv_credits ?? 0) < 1) {
      return NextResponse.redirect(new URL('/payment', req.url))
    }
  }

  return res
}


export const config = {
  // Apply middleware to protect dashboard, upload, and results pages
  matcher: ['/upload/:path*', '/dashboard/:path*', '/result/:path*'],
}
