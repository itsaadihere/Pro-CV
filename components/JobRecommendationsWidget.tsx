'use client'

import { useEffect, useState } from 'react'

interface JobMatch {
  id: string
  title: string
  company_name: string
  location_city: string
  location_type: string
  salary_min?: number
  salary_max?: number
  match_score: number
  matched_keywords: string[]
}

export default function JobRecommendationsWidget({
  userId,
  cvKeywords,
}: {
  userId: string
  cvKeywords: string[]
}) {
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId && (!cvKeywords || cvKeywords.length === 0)) {
      setLoading(false)
      return
    }

    fetch('/api/job-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, keywords: cvKeywords || [] }),
    })
      .then((r) => r.json())
      .then((data) => {
        setJobs(data.jobs || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load job recommendations:', err)
        setLoading(false)
      })
  }, [userId, cvKeywords])

  if (loading) {
    return (
      <div className="mt-10 border-t border-slate-200 pt-8 animate-pulse">
        <div className="h-6 w-64 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-48 bg-slate-100 rounded mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (jobs.length === 0) return null

  const CAREER_PORTAL_URL = process.env.NEXT_PUBLIC_CAREER_PORTAL_URL || 'https://career.joinsophi.com'

  return (
    <div className="mt-10 border-t border-slate-200 pt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🎯 Jobs That Match Your New CV
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Based on the AI-extracted keywords in your optimized CV
          </p>
        </div>
        <a
          href={CAREER_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all jobs →
        </a>
      </div>

      <div className="grid gap-3">
        {jobs.slice(0, 3).map((job) => (
          <a
            key={job.id}
            href={`${CAREER_PORTAL_URL}/jobs/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all group shadow-sm"
          >
            <div>
              <div className="font-semibold text-slate-900 group-hover:text-blue-700 text-base">
                {job.title}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {job.company_name} · {job.location_city || 'Pakistan'} ·{' '}
                <span className="capitalize">{job.location_type || 'onsite'}</span>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {job.matched_keywords.slice(0, 4).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-medium"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right ml-4 shrink-0">
              <div className="text-2xl font-black text-blue-600">{job.match_score}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">match</div>
              {job.salary_min && job.salary_max ? (
                <div className="text-xs text-slate-600 font-medium mt-1">
                  PKR {(job.salary_min / 1000).toFixed(0)}k–{(job.salary_max / 1000).toFixed(0)}k
                </div>
              ) : null}
            </div>
          </a>
        ))}
      </div>

      <a
        href={CAREER_PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full block text-center py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
      >
        Explore All Matching Jobs on Sophi Careers →
      </a>
    </div>
  )
}
