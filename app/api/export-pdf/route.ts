import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { generateCVBuffer } from '@/lib/pdf-export'

export const dynamic = 'force-dynamic'


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    const template = (searchParams.get('template') || 'ats') as 'ats' | 'modern' | 'executive'

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 })
    }

    if (!['ats', 'modern', 'executive'].includes(template)) {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    
    // Fetch the generated CV text from the database
    const { data: job, error: dbError } = await supabase
      .from('cv_jobs')
      .select('generated_cv')
      .eq('id', jobId)
      .single()

    if (dbError || !job) {
      console.error('Error fetching job for PDF export:', dbError)
      return NextResponse.json({ error: 'Job not found in database' }, { status: 404 })
    }

    if (!job.generated_cv) {
      return NextResponse.json({ error: 'CV content is empty or not yet generated' }, { status: 400 })
    }

    // Generate the PDF buffer
    const pdfBuffer = await generateCVBuffer(job.generated_cv, template)

    // Return the PDF buffer directly with headers triggering download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ProCV-${template}-${jobId.substring(0, 8)}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Error in /api/export-pdf:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during PDF generation' },
      { status: 500 }
    )
  }
}
