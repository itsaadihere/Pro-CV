'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import { FileUp, MessageSquarePlus, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

export default function ChoicePage() {
  const router = useRouter()
  const supabase = getClientSupabase()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expired. Please log in.')
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('cv_credits')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.cv_credits === 0) {
        router.push('/payment')
        return
      }

      setLoading(false)
    }

    checkAccess()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Checking access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            How would you like to start?
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Choose whether to revamp your existing CV or create a completely new one from scratch through an interactive interview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Revamp Option */}
          <button
            onClick={() => router.push('/upload')}
            className="relative flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-slate-200 bg-white transition-all hover:border-primary hover:shadow-xl hover:shadow-primary-100 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary transition-colors mb-6">
              <FileUp className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Revamp Current CV</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Upload your existing CV (PDF or DOCX). Our AI will analyze, rewrite, and optimize it for ATS systems automatically.
            </p>
          </button>

          {/* Create from Scratch Option */}
          <button
            onClick={() => router.push('/chat')}
            className="relative flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-slate-200 bg-white transition-all hover:border-primary hover:shadow-xl hover:shadow-primary-100 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary transition-colors mb-6">
              <MessageSquarePlus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Create From Scratch</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Don&apos;t have a CV yet? Chat with our AI or drop voice notes to tell us about your experience, and we&apos;ll build one for you.
            </p>
          </button>
        </div>
      </main>
    </div>
  )
}
