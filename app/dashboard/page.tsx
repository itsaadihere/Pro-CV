'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import {
  FileText,
  CreditCard,
  PlusCircle,
  TrendingUp,
  Eye,
  Calendar,
  MessageSquare,
  Loader2,
  AlertCircle,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

import Header from '@/components/Header'
import { isBetaActive } from '@/lib/beta'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error('Session expired. Please log in.')
          router.push('/login')
          return
        }

        // Fetch User Profile
        const { data: prof, error: profError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        let finalProf = prof
          if (profError) {
          console.warn('Profile not found in profiles table. Attempting to create profile record.')
          const isTestUser = session.user.email?.toLowerCase() === 'test@joinsophi.com'
          const { data: newProf } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              has_paid: isTestUser,
              cv_credits: isTestUser ? 100 : 0,
            })
            .select('*')
            .single()

          finalProf = newProf
        }

        const isTestUser = session.user.email?.toLowerCase() === 'test@joinsophi.com'
        if (isTestUser && finalProf && finalProf.cv_credits === 0) {
          // If for some reason they have 0 credits, we shouldn't refill unless asked (per requirement).
          // "only there is an account that is the test ID wont be needing to pay for CV as this acount already have 100 credit in balance and just in case this acount credit ends I will ask you to again refill but don't refill on your own only when I say to you"
          // So we do NOT auto refill.
        }
        setProfile(finalProf)

        // Fetch user CV optimization jobs
        const { data: cvJobs, error: cvJobsError } = await supabase
          .from('cv_jobs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (!cvJobsError && cvJobs) {
          setJobs(cvJobs)
        }

      } catch (err: any) {
        toast.error(err.message || 'Error loading dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [supabase, router])

  const credits = profile?.cv_credits ?? 0

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {profile?.full_name || 'Professional'}!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Account ID: <span className="font-mono text-slate-700">{profile?.id.substring(0, 8)}...</span> | email: {profile?.email}
              </p>
            </div>
          </div>

          {/* Credits Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Credits Remaining</span>
              <span className="block text-3xl font-extrabold text-slate-950">{credits}</span>
            </div>
            <Link
              href={credits > 0 ? '/choice' : '/payment'}
              className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-primary-800 hover:shadow-md hover:shadow-primary-100"
            >
              <PlusCircle className="h-4 w-4 text-gold" />
              <span>{credits > 0 ? 'Create CV' : 'Buy Slots'}</span>
            </Link>
          </div>
        </div>

        {/* CV Jobs History */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Your CV Revamp History</h2>
            <span className="text-xs text-slate-400 font-semibold">{jobs.length} total requests</span>
          </div>

          {jobs.length === 0 ? (
            /* Empty state placeholder */
            <div className="text-center py-20 px-4 space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FileText className="h-6 w-6" />
              </div>
              <div className="max-w-sm mx-auto space-y-2">
                <h3 className="text-sm font-semibold text-slate-800">No revamp jobs found</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  You haven&apos;t optimized any CVs yet. Purchase credits or upload your file to start transforming your career materials.
                </p>
              </div>
              <div>
                <Link
                  href={credits > 0 ? '/choice' : '/payment'}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-primary-800 shadow-sm hover:shadow-primary-100"
                >
                  <span>Create My First CV</span>
                  <PlusCircle className="h-4 w-4 text-gold" />
                </Link>
              </div>
            </div>
          ) : (
            /* Jobs history table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Created</th>
                    <th className="py-4 px-6">Industry</th>
                    <th className="py-4 px-6">ATS Score</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {jobs.map((job) => {
                    const jobDate = new Date(job.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                    const atsScore = job.ats_score?.overall || 'N/A'

                    return (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4.5 px-6 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{jobDate}</span>
                        </td>
                        <td className="py-4.5 px-6">{job.target_industry}</td>
                        <td className="py-4.5 px-6 font-bold text-slate-800">
                          {job.status === 'completed' ? (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5 text-gold" />
                              <span>{atsScore}/100</span>
                            </div>
                          ) : (
                            <span className="text-slate-405">—</span>
                          )}
                        </td>
                        <td className="py-4.5 px-6">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            job.status === 'completed'
                              ? 'bg-gold-50 text-gold-700 border border-gold-100'
                              : job.status === 'processing'
                              ? 'bg-primary-50 text-primary border border-primary-100'
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          <Link
                            href={job.status === 'completed' ? `/result/${job.id}` : '#'}
                            className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 ${
                              job.status !== 'completed' ? 'pointer-events-none opacity-50' : ''
                            }`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Report</span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Floating WhatsApp Support Action Button */}
      <a
        href="https://wa.me/923000000000?text=I%20need%20help%20with%20my%20Sophi%20transformation"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-lg transition-transform hover:scale-105 hover:bg-gold-600 hover:shadow-gold-200 animate-bounce"
        title="WhatsApp Support"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </div>
  )
}
