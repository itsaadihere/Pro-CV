import { getTemplate } from '@/components/cv-templates'
import { parseKimiCV } from '@/lib/cvParser'
import { getServiceSupabase } from '@/lib/supabase-server'

export default async function CVRenderPage({
  params,
  searchParams
}: {
  params: { jobId: string }
  searchParams: { template: string }
}) {
  const supabase = getServiceSupabase()
  const { data: job } = await supabase
    .from('cv_jobs')
    .select('generated_cv')
    .eq('id', params.jobId)
    .single()

  if (!job || !job.generated_cv) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', color: '#ef4444' }}>
        <h3>Error: Job not found or CV content is empty.</h3>
      </div>
    )
  }

  const cvData = parseKimiCV(job.generated_cv)
  const templateId = searchParams.template || 'min-14-white-blue-minimalist-corporate-ats'
  const TemplateComponent = getTemplate(templateId)

  return (
    <html>
      <head>
        <title>{cvData.fullName || 'CV'} - ProCV</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Georgia:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}</style>
      </head>
      <body>
        <TemplateComponent data={cvData} scale={1} />
      </body>
    </html>
  )
}
export const dynamic = 'force-dynamic'
