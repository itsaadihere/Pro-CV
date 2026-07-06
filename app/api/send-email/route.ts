import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { generateCVBuffer } from '@/lib/pdf-export'
import { formatCVWithGemini } from '@/lib/gemini'
import { sendCVEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { jobId, template = 'ats', color = 'classic', cvText } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // 1. Fetch job and user profile
    const { data: job, error: jobError } = await supabase
      .from('cv_jobs')
      .select('generated_cv, user_id, email_sent, template_used')
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

    // 2. Retrieve the pre-rendered PDF from Supabase storage
    const templateId = job.template_used || template || 'min-14-white-blue-minimalist-corporate-ats'
    const filePath = `cv-outputs/${jobId}/${templateId}.pdf`
    
    let pdfBuffer: Buffer
    
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('cv-outputs')
      .download(filePath)

    if (downloadError || !fileData) {
      console.warn('Pre-rendered PDF not found in storage. Rendering on-demand in email dispatch...', downloadError)
      try {
        const host = req.headers.get('host') || 'localhost:3000'
        const protocol = host.includes('localhost') ? 'http' : 'https'
        const appUrl = `${protocol}://${host}`
        
        const exportRes = await fetch(`${appUrl}/api/export-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, templateId })
        })
        
        if (!exportRes.ok) throw new Error('Fallback PDF generation failed')
        
        const { data: retryData } = await supabase.storage
          .from('cv-outputs')
          .download(filePath)
          
        if (!retryData) throw new Error('Failed to download fallback PDF')
        pdfBuffer = Buffer.from(await retryData.arrayBuffer())
      } catch (err) {
        console.error('Fallback generation error:', err)
        pdfBuffer = await generateCVBuffer(cvText || job.generated_cv, 'ats', 'classic')
      }
    } else {
      pdfBuffer = Buffer.from(await fileData.arrayBuffer())
    }

    // 3. Send email
    const emailSent = await sendCVEmail({
      userEmail: profile.email,
      userName: profile.full_name || '',
      jobId,
      pdfBuffer,
    })

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email via Titan Mail. Ensure your SMTP credentials are configured correctly in your .env.local file, or check server logs.' },
        { status: 500 }
      )
    }

    // Update job status to record email dispatch
    await supabase
      .from('cv_jobs')
      .update({ email_sent: true })
      .eq('id', jobId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in /api/send-email:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during email dispatch' },
      { status: 500 }
    )
  }
}
