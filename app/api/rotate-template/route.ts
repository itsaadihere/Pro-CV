import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { TemplateRotationEngine } from '@/lib/templateRotation'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { jobId, preferredStyle = 'random' } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // 1. Fetch current job to get user details
    let job: any = null
    let jobError: any = null

    const firstAttempt = await supabase
      .from('cv_jobs')
      .select('user_id, template_used')
      .eq('id', jobId)
      .single()

    job = firstAttempt.data
    jobError = firstAttempt.error

    if (jobError && (jobError.code === '42703' || jobError.message?.includes('template_used'))) {
      const fallbackQuery = await supabase
        .from('cv_jobs')
        .select('user_id')
        .eq('id', jobId)
        .single()
      job = fallbackQuery.data
      jobError = fallbackQuery.error
    }

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found or query failed' }, { status: 404 })
    }

    // 2. Select next template using the rotation engine
    const rotation = new TemplateRotationEngine()
    const nextTemplateId = await rotation.getNextTemplate(job.user_id, preferredStyle)

    // 3. Trigger Puppeteer PDF generation for the next template
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const appUrl = `${protocol}://${host}`

    const exportRes = await fetch(`${appUrl}/api/export-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        templateId: nextTemplateId,
      }),
    })

    if (!exportRes.ok) {
      const errorText = await exportRes.text()
      throw new Error(`PDF export failed during template rotation: ${errorText}`)
    }

    const exportData = await exportRes.json()

    return NextResponse.json({
      success: true,
      templateId: nextTemplateId,
      pdfUrl: exportData.pdfUrl,
    })
  } catch (error: any) {
    console.error('Error in /api/rotate-template:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during template rotation' },
      { status: 500 }
    )
  }
}
