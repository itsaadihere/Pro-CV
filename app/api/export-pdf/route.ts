import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

async function getBrowserInstance() {
  const isProd = process.env.NODE_ENV === 'production'
  
  if (isProd) {
    const puppeteerCore = await import('puppeteer-core')
    const chromium = (await import('@sparticuz/chromium')).default as any
    
    return await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })
  } else {
    const puppeteer = await import('puppeteer')
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { jobId, templateId, color } = await req.json()

    if (!jobId || !templateId) {
      return NextResponse.json({ error: 'Missing jobId or templateId' }, { status: 400 })
    }

    const browser = await getBrowserInstance()
    const page = await browser.newPage()

    // Determine the base URL dynamically from request headers
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const appUrl = `${protocol}://${host}`

    const renderUrl = `${appUrl}/cv-render/${jobId}?template=${templateId}${color ? `&color=${color}` : ''}`
    console.log('Puppeteer navigating to render URL:', renderUrl)
    
    await page.goto(renderUrl, { waitUntil: 'networkidle0' })

    // Export A4 PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    })

    await browser.close()

    // Upload PDF to Supabase Storage
    const supabase = getServiceSupabase()
    const filePath = `cv-outputs/${jobId}/${templateId}.pdf`
    
    let uploadRes = await supabase.storage
      .from('cv-outputs')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadRes.error) {
      const isBucketError = uploadRes.error.message?.includes('bucket') || 
                          uploadRes.error.message?.includes('does not exist') ||
                          uploadRes.error.message?.includes('not found')
                          
      if (isBucketError) {
        console.warn('cv-outputs storage bucket not found. Attempting to create it...')
        const { error: createError } = await supabase.storage.createBucket('cv-outputs', {
          public: true,
          allowedMimeTypes: ['application/pdf'],
        })
        
        if (!createError) {
          console.log('Successfully created cv-outputs bucket. Retrying upload...')
          uploadRes = await supabase.storage
            .from('cv-outputs')
            .upload(filePath, pdfBuffer, {
              contentType: 'application/pdf',
              upsert: true
            })
        } else {
          console.error('Failed to create bucket cv-outputs:', createError)
        }
      }
    }

    if (uploadRes.error) {
      console.error('Supabase upload error:', uploadRes.error)
      return NextResponse.json({ error: 'Failed to upload PDF to storage: ' + uploadRes.error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('cv-outputs')
      .getPublicUrl(filePath)

    // Update job details in Supabase
    const { error: updateError } = await supabase
      .from('cv_jobs')
      .update({
        pdf_output_path: publicUrl,
        template_used: templateId
      })
      .eq('id', jobId)

    if (updateError) {
      console.error('Supabase update job error:', updateError)
      return NextResponse.json({ error: 'Failed to update job record: ' + updateError.message }, { status: 500 })
    }

    return NextResponse.json({ pdfUrl: publicUrl })
  } catch (error: any) {
    console.error('Error in export-pdf POST:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during PDF generation' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    let templateId = searchParams.get('template')
    const color = searchParams.get('color')

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    
    // Fetch the job details
    const { data: job, error: dbError } = await supabase
      .from('cv_jobs')
      .select('pdf_output_path, template_used, user_id')
      .eq('id', jobId)
      .single()

    if (dbError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Resolve template ID
    if (!templateId) {
      templateId = job.template_used
    }

    if (!templateId) {
      const { TemplateRotationEngine } = await import('@/lib/templateRotation')
      const rotation = new TemplateRotationEngine()
      templateId = await rotation.getNextTemplate(job.user_id, 'random')
    }

    // Generate the PDF
    const browser = await getBrowserInstance()
    const page = await browser.newPage()

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const appUrl = `${protocol}://${host}`

    const renderUrl = `${appUrl}/cv-render/${jobId}?template=${templateId}${color ? `&color=${color}` : ''}`
    await page.goto(renderUrl, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    })

    await browser.close()

    // Upload to Supabase Storage
    const filePath = `cv-outputs/${jobId}/${templateId}.pdf`
    await supabase.storage
      .from('cv-outputs')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    const { data: { publicUrl } } = supabase.storage
      .from('cv-outputs')
      .getPublicUrl(filePath)

    // Update job details in Supabase
    await supabase
      .from('cv_jobs')
      .update({
        pdf_output_path: publicUrl,
        template_used: templateId
      })
      .eq('id', jobId)

    // Return the PDF buffer directly for download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ProCV-${templateId}-${jobId.substring(0, 8)}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Error in export-pdf GET:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during PDF generation' },
      { status: 500 }
    )
  }
}
