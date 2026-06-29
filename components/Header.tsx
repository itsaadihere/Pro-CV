'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { FileText, LogOut, User as UserIcon, CreditCard, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { isBetaActive } from '@/lib/beta'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getClientSupabase()
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      
      if (session?.user) {
        // Fetch credits
        const { data: profile } = await supabase
          .from('profiles')
          .select('cv_credits')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setCredits(profile.cv_credits)
        }
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('cv_credits')
          .eq('id', session.user.id)
          .single()
        if (profile) {
          setCredits(profile.cv_credits)
        }
      } else {
        setCredits(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, pathname])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
    }
  }

  const isAuthPage = pathname === '/login'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-200">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              Pro<span className="text-blue-600">CV</span>.pk
            </span>
          </Link>
        </div>

        {/* Navigation / Actions */}
        {!isAuthPage && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`hidden text-sm font-medium transition-colors md:block ${
                    pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>

                {isBetaActive() ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Free Beta Active</span>
                  </div>
                ) : (
                  credits !== null && (
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                      <span>{credits} {credits === 1 ? 'Credit' : 'Credits'}</span>
                    </div>
                  )
                )}

                <Link
                  href={isBetaActive() || (credits && credits > 0) ? '/upload' : '/payment'}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-100"
                >

                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">New Transform</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-100"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
