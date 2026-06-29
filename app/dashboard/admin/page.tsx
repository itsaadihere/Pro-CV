'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import {
  Users,
  FileText,
  TrendingUp,
  Smile,
  ArrowLeft,
  Loader2,
  Lock,
  MessageSquare,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const [stats, setStats] = useState({
    totalBetaUsers: 0,
    totalBetaCVs: 0,
    avgAtsScore: 0,
    satisfactionRate: 100,
    ratingCounts: {
      loved: 0,
      good: 0,
      average: 0,
      needsWork: 0
    }
  })

  const [feedbacks, setFeedbacks] = useState<any[]>([])

  useEffect(() => {
    async function loadAdminData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        // Fetch User Profile to confirm admin access
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', session.user.id)
          .single()

        if (profileError || !profile || profile.email !== 'syedsaad.mob@gmail.com') {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        setIsAdmin(true)

        // 1. Get total beta users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_beta_user', true)

        // 2. Get total beta jobs and average ATS score
        const { data: jobs } = await supabase
          .from('cv_jobs')
          .select('ats_score')
          .eq('is_beta_job', true)

        let totalScore = 0
        let jobsWithScore = 0
        if (jobs) {
          jobs.forEach(j => {
            const score = j.ats_score?.overall
            if (typeof score === 'number') {
              totalScore += score
              jobsWithScore++
            }
          })
        }

        const avgScore = jobsWithScore > 0 ? Math.round(totalScore / jobsWithScore) : 0

        // 3. Fetch all feedback
        const { data: feedbackData } = await supabase
          .from('beta_feedback')
          .select('id, rating, comment, created_at, user_id, profiles(email, full_name)')
          .order('created_at', { ascending: false })

        // Calculate rating breakdown
        let loved = 0, good = 0, average = 0, needsWork = 0
        if (feedbackData) {
          feedbackData.forEach(fb => {
            const r = fb.rating || ''
            if (r.includes('Loved')) loved++
            else if (r.includes('Good')) good++
            else if (r.includes('Average')) average++
            else if (r.includes('Needs')) needsWork++
          })
          setFeedbacks(feedbackData)
        }

        const totalFeedback = loved + good + average + needsWork
        const positiveFeedback = loved + good
        const satRate = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 100

        setStats({
          totalBetaUsers: userCount || 0,
          totalBetaCVs: jobs?.length || 0,
          avgAtsScore: avgScore,
          satisfactionRate: satRate,
          ratingCounts: { loved, good, average, needsWork }
        })

      } catch (err: any) {
        toast.error(err.message || 'Error loading administrator metrics.')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Retrieving system stats...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-md text-center py-24 px-4">
          <div className="rounded-2xl border border-red-100 bg-red-50/40 p-8 shadow-sm flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-inner">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900">Access Denied</h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              You do not have administrative privileges to view this page. Restricted to ProCV site administrator accounts only.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Beta Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time system telemetry and satisfaction feedback metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {/* Card 1: Users */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Beta Users</span>
              <span className="block text-3xl font-extrabold text-slate-950">{stats.totalBetaUsers}</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: CVs Generated */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">CVs Generated</span>
              <span className="block text-3xl font-extrabold text-slate-950">{stats.totalBetaCVs}</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: ATS Score */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg ATS Score</span>
              <span className="block text-3xl font-extrabold text-slate-950">{stats.avgAtsScore}/100</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Card 4: Satisfaction */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Satisfaction</span>
              <span className="block text-3xl font-extrabold text-slate-950">{stats.satisfactionRate}%</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Smile className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Breakdown - Left Side */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit space-y-6">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Rating Breakdown</h3>
            
            <div className="space-y-4 text-xs font-semibold text-slate-655">
              {/* Loved it */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Loved it ⭐</span>
                  <span>{stats.ratingCounts.loved}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${stats.totalBetaCVs > 0 ? (stats.ratingCounts.loved / feedbacks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Good */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Good 👍</span>
                  <span>{stats.ratingCounts.good}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${stats.totalBetaCVs > 0 ? (stats.ratingCounts.good / feedbacks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Average */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Average 😐</span>
                  <span>{stats.ratingCounts.average}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${stats.totalBetaCVs > 0 ? (stats.ratingCounts.average / feedbacks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Needs work */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Needs work 👎</span>
                  <span>{stats.ratingCounts.needsWork}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${stats.totalBetaCVs > 0 ? (stats.ratingCounts.needsWork / feedbacks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Feed - Right Side */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-base font-bold text-slate-800">Beta Tester Feedback Feed</h3>
            </div>

            {feedbacks.length === 0 ? (
              <div className="text-center py-20 text-slate-400 space-y-3">
                <MessageSquare className="h-8 w-8 mx-auto text-slate-300" />
                <p className="text-xs">No feedback forms submitted yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-800">
                        {fb.profiles?.full_name || 'Anonymous User'} 
                        <span className="font-normal text-slate-400 font-mono ml-2">({fb.profiles?.email || 'N/A'})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(fb.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                        {fb.rating}
                      </span>
                    </div>

                    {fb.comment && (
                      <p className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-150 leading-relaxed italic">
                        &ldquo;{fb.comment}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
