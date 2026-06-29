import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { generateCVBuffer } from '@/lib/pdf-export'
import { sendCVEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // 1. Fetch job and user profile
    const { data: job, error: jobError } = await supabase
      .from('cv_jobs')
      .select('generated_cv, user_id, email_sent')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found in database' }, { status: 404 })
    }

    if (!job.generated_cv) {
      return NextResponse.json({ error: 'CV content is empty or not yet generated' }, { status: 400 })
    }

    // Fetch user profile email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', job.user_id)
      .single()

    if (profileError || !profile || !profile.email) {
      return NextResponse.json({ error: 'Associated user profile or email not found' }, { status: 404 })
    }

    // 2. Generate PDF (using 'ats' template as the attachment)
    const pdfBuffer = await generateCVBuffer(job.generated_cv, 'ats')

    // 3. Send email
    const emailSent = await sendCVEmail({
      userEmail: profile.email,
      userName: profile.full_name || '',
      jobId,
      pdfBuffer,
    })

    if (emailSent) {
      // Update job status to record email dispatch
      await supabase
        .from('cv_jobs')
        .update({ email_sent: true })
        .eq('id', jobId)
    }

    return NextResponse.json({ success: emailSent })
  } catch (error: any) {
    console.error('Error in /api/send-email:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during email dispatch' },
      { status: 500 }
    )
  }
}
