'use client'

import { useState } from 'react'
import { getClientSupabase } from '@/lib/supabase'
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginMode, setLoginMode] = useState<'magic' | 'password'>('magic')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = getClientSupabase()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      if (loginMode === 'magic') {
        const redirectUrl = `${window.location.origin}/auth/callback`
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectUrl,
          },
        })

        if (error) throw error

        setSent(true)
        toast.success('Magic link sent to your email!')
      } else {
        // Password login
        if (!password) {
          toast.error('Please enter your password.')
          setLoading(false)
          return
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast.success('Logged in successfully!')
        // Redirect will be handled by Supabase session listener or manual route push
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to landing page</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setLoginMode(loginMode === 'magic' ? 'password' : 'magic')
              setSent(false)
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
          >
            {loginMode === 'magic' ? 'Use Password Sign In' : 'Use Magic Link Sign In'}
          </button>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to ProCV
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {loginMode === 'magic'
              ? "No password needed. We'll email you a secure login link."
              : 'Enter your credentials below to log in.'}
          </p>
        </div>

        {sent && loginMode === 'magic' ? (
          <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-6 text-center animate-fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <Mail className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Check your email</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              We sent a magic link to <strong className="text-slate-900">{email}</strong>.
              Click the link to log in instantly.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-5 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              Didn&apos;t receive it? Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full rounded-lg border border-slate-350 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {loginMode === 'password' && (
                <div className="animate-fade-in">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-slate-350 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-blue-400 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{loginMode === 'magic' ? 'Sending login link...' : 'Logging in...'}</span>
                  </>
                ) : (
                  <span>{loginMode === 'magic' ? 'Send Magic Link' : 'Sign In'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

