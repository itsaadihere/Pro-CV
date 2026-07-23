import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { userId, keywords } = await req.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Clean and normalize the incoming keywords
    const normalizedKeywords = (keywords || [])
      .map((k: string) => k.toLowerCase().trim())
      .filter((k: string) => k.length > 2)

    // Fetch active jobs from Supabase
    const { data: activeJobs } = await supabase
      .from('jobs')
      .select('id, title, company_name, location_city, location_type, salary_min, salary_max, keywords')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .limit(100)

    if (!activeJobs || activeJobs.length === 0) {
      return NextResponse.json({ jobs: [] })
    }

    // Score each job against the CV keywords
    const scoredJobs = activeJobs
      .map((job: any) => {
        const jobKeywords = (job.keywords ?? []).map((k: string) => k.toLowerCase())
        const matched = normalizedKeywords.filter((cvKw: string) =>
          jobKeywords.some((jobKw: string) =>
            jobKw.includes(cvKw) || cvKw.includes(jobKw)
          )
        )
        const matchScore = Math.min(
          100,
          Math.round((matched.length / Math.max(normalizedKeywords.length, 1)) * 100)
        )
        return { ...job, match_score: matchScore, matched_keywords: matched }
      })
      .filter((job: any) => job.match_score >= 30) // Only show 30%+ matches
      .sort((a: any, b: any) => b.match_score - a.match_score)
      .slice(0, 6) // Top 6 matches

    // Save recommendations to DB for future reference + analytics
    if (scoredJobs.length > 0 && userId) {
      const recommendationRows = scoredJobs.map((job: any) => ({
        user_id: userId,
        job_id: job.id,
        match_score: job.match_score,
        matched_keywords: job.matched_keywords
      }))

      await supabase
        .from('job_recommendations')
        .upsert(recommendationRows, { onConflict: 'user_id,job_id' })
    }

    return NextResponse.json({ jobs: scoredJobs })
  } catch (err: any) {
    console.error('Job recommendations API error:', err)
    return NextResponse.json({ jobs: [] }, { status: 500 })
  }
}
