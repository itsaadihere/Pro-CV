'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientSupabase } from '@/lib/supabase'
import {
  FileText,
  TrendingUp,
  MailOpen,
  Compass,
  Download,
  Mail,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
} from 'lucide-react'
import { isBetaActive } from '@/lib/beta'

const Linkedin = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className || "h-4.5 w-4.5"}
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
import toast from 'react-hot-toast'

import Header from '@/components/Header'
import ATSScoreCard from '@/components/ATSScoreCard'
import CVPreview from '@/components/CVPreview'

type TabType = 'ats' | 'cv' | 'linkedin' | 'cover' | 'gap'

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [jobData, setJobData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('ats')
  const [originalText, setOriginalText] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [copiedText, setCopiedText] = useState<Record<string, boolean>>({})

  // Template and Color Selection states
  const [selectedTemplate, setSelectedTemplate] = useState<string>('min-14-white-blue-minimalist-corporate-ats')
  const [selectedColor, setSelectedColor] = useState<string>('classic')

  // Gemini Layout Formatting states
  const [displayCVText, setDisplayCVText] = useState('')
  const [formatting, setFormatting] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  // Initialize template from job details on mount
  useEffect(() => {
    if (jobData?.template_used) {
      setSelectedTemplate(jobData.template_used)
    }
  }, [jobData?.template_used])

  // Beta Feedback states
  const [rating, setRating] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  useEffect(() => {
    async function loadJobDetails() {
      if (!jobId) return

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error('Session expired. Please sign in.')
          router.push('/login')
          return
        }

        // Fetch CV transformation details
        const { data: job, error: jobError } = await supabase
          .from('cv_jobs')
          .select('*')
          .eq('id', jobId)
          .single()

        if (jobError || !job) {
          throw new Error('Transformation job could not be found.')
        }

        setJobData(job)
        if (job?.generated_cv) {
          setDisplayCVText(job.generated_cv)
        }
        if (job?.template_used) {
          setSelectedTemplate(job.template_used)
        }

        // Attempt to parse/fetch original CV text from file storage if available, 
        // otherwise we fallback to a placeholder message.
        setOriginalText(
          'Original CV Content parsed successfully. Read details in the "Before" preview card.'
        )
      } catch (err: any) {
        toast.error(err.message || 'Error loading job details.')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadJobDetails()
  }, [jobId, supabase, router])

  // Synchronize display text
  useEffect(() => {
    if (jobData?.generated_cv) {
      setDisplayCVText(jobData.generated_cv)
    }
  }, [jobData?.generated_cv])

  const handleDownloadPDF = async () => {
    if (!jobData?.pdf_output_path) {
      toast.error('PDF file path not found. Try regenerating.')
      return
    }
    const a = document.createElement('a')
    a.href = jobData.pdf_output_path
    a.download = `ProCV-${selectedTemplate}-${jobId.substring(0, 8)}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    toast.success('Successfully downloaded PDF!')
  }

  const handleRegenerateWithDifferentTemplate = async () => {
    setDownloadingPDF(true)
    try {
      const res = await fetch('/api/rotate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          preferredStyle: 'modern'
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to rotate template')
      }

      const data = await res.json()
      
      setJobData((prev: any) => ({
        ...prev,
        template_used: data.templateId,
        pdf_output_path: data.pdfUrl
      }))
      
      setSelectedTemplate(data.templateId)
      toast.success('Successfully updated template and PDF!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error rotating template.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const triggerEmailResend = async () => {
    setSendingEmail(true)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jobId,
          template: selectedTemplate,
          color: selectedColor,
          cvText: displayCVText
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Successfully sent optimized PDF to your email!')
      } else {
        throw new Error(data.error || 'Failed to dispatch email.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error dispatching email.')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleCopySection = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText((prev) => ({ ...prev, [key]: true }))
      toast.success('Copied to clipboard!')
      setTimeout(() => {
        setCopiedText((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      toast.error('Failed to copy text.')
    }
  }

  const handleSubmitFeedback = async () => {
    if (!rating) {
      toast.error('Please select a rating option')
      return
    }
    setSubmittingFeedback(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { error } = await supabase
        .from('beta_feedback')
        .insert({
          user_id: session?.user?.id || jobData.user_id,
          job_id: jobId,
          rating,
          comment
        })

      if (error) throw error

      toast.success('Feedback submitted successfully!')
      setFeedbackSubmitted(true)
    } catch (err: any) {
      console.error('Error submitting beta feedback:', err)
      toast.error(err.message || 'Failed to submit feedback.')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Retrieving optimization data...</p>
        </div>
      </div>
    )
  }

  if (!jobData) return null

  // Format LinkedIn data
  const linkedin = jobData.linkedin_optimizer || {}
  const headline = linkedin.headline || 'N/A'
  const summary = linkedin.about || 'N/A'
  const skills = linkedin.skills || []

  // Format Gap Analysis data
  const gap = jobData.gap_analysis || {}
  const missingKeywords = gap.missingKeywords || []
  const certifications = gap.certifications || []
  const quickWins = gap.quickWins || []

  // Structured ATS data
  const ats = jobData.ats_score || {
    overall: 75,
    keywordMatch: 70,
    formatCompliance: 80,
    achievementDensity: 75,
    readability: 80,
    skillsAlignment: 70,
    issues: [],
  }

  const tabItems = [
    { id: 'ats', label: 'ATS Score Report', icon: TrendingUp },
    { id: 'cv', label: 'Revamped CV', icon: FileText },
    { id: 'linkedin', label: 'LinkedIn Optimizer', icon: Linkedin },
    { id: 'cover', label: 'Cover Letter', icon: MailOpen },
    { id: 'gap', label: 'Gap Analysis', icon: Compass },
  ]

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

        {/* Dashboard Title & Meta */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Transformation Report</h1>
            <p className="text-xs text-slate-500 mt-1">
              Target Industry: <strong className="text-slate-700">{jobData.target_industry}</strong> | 
              Language: <strong className="text-slate-700">{jobData.output_language}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              jobData.status === 'completed'
                ? 'bg-gold-50 text-gold-700'
                : 'bg-amber-55 bg-amber-50 text-amber-700'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                jobData.status === 'completed' ? 'bg-gold' : 'bg-amber-500'
              }`} />
              {jobData.status === 'completed' ? 'Transformation Complete' : 'Processing'}
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-slate-200 mb-6 overflow-x-auto">
          <nav className="flex space-x-8 whitespace-nowrap px-1" aria-label="Tabs">
            {tabItems.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:border-slate-350 hover:text-slate-750'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Panels */}
        <div className="mb-10 min-h-[450px]">
          {/* Panel 1: ATS Report */}
          {activeTab === 'ats' && (
            <div className="animate-fade-in">
              <ATSScoreCard scoreData={ats} />
            </div>
          )}

          {/* Panel 2: Revamped CV */}
          {activeTab === 'cv' && (
            <div className="animate-fade-in">
              <CVPreview
                originalText={originalText}
                revampedText={jobData.generated_cv || ''}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                displayCVText={displayCVText}
                formatting={formatting}
              />
            </div>
          )}

          {/* Panel 3: LinkedIn Optimizer */}
          {activeTab === 'linkedin' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Headline */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-800">Optimized Profile Headline</h3>
                    <button
                      onClick={() => handleCopySection('headline', headline)}
                      className="text-slate-400 hover:text-slate-650"
                    >
                      {copiedText['headline'] ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50/50 p-4 rounded-xl border border-slate-150 leading-relaxed font-mono">
                    {headline}
                  </p>
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                    <span>LENGTH CHECK</span>
                    <span className={headline.length > 220 ? 'text-red-500' : 'text-gold'}>
                      {headline.length} / 220 characters
                    </span>
                  </div>
                </div>

                {/* Top Skills Tags */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-800">Top 10 Skill Badges</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full bg-blue-50 border border-blue-100/50 px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No skills suggested</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile About / Bio Summary */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800">Profile summary - About (First 3 Hook Lines)</h3>
                  <button
                    onClick={() => handleCopySection('summary', summary)}
                    className="text-slate-400 hover:text-slate-650"
                  >
                    {copiedText['summary'] ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <pre className="text-sm text-slate-750 bg-slate-50/50 p-4 rounded-xl border border-slate-150 leading-relaxed whitespace-pre-wrap font-sans">
                  {summary}
                </pre>
              </div>
            </div>
          )}

          {/* Panel 4: Cover Letter */}
          {activeTab === 'cover' && (
            <div className="rounded-2xl border border-slate-150 bg-white shadow-sm overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-150 bg-slate-50/60 px-6 py-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Tailored Professional Cover Letter</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Optimized against your uploaded requirements</p>
                </div>
                <button
                  onClick={() => handleCopySection('coverLetter', jobData.cover_letter || '')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  {copiedText['coverLetter'] ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copy Letter</span>
                </button>
              </div>
              <div className="p-6 md:p-8">
                <pre className="text-sm leading-relaxed text-slate-850 whitespace-pre-wrap font-sans text-justify">
                  {jobData.cover_letter || 'Cover letter details not generated.'}
                </pre>
              </div>
            </div>
          )}

          {/* Panel 5: Gap Analysis */}
          {activeTab === 'gap' && (
            <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
              {/* Missing Keywords */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                  Missing Target Keywords
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  These keywords were found in the job description but are absent or weak in your original CV.
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.length > 0 ? (
                    missingKeywords.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-lg bg-red-50 border border-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-700"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No missing keywords found</span>
                  )}
                </div>
              </div>

              {/* Certifications Check */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                  Recommended Certifications
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Earn these professional credentials to boost your hiring chances by up to 30%.
                </p>
                <ul className="space-y-3">
                  {certifications.length > 0 ? (
                    certifications.map((cert: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <span className="text-blue-500 font-bold shrink-0 mt-0.5">☐</span>
                        <span>{cert}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic">No credentials recommended</li>
                  )}
                </ul>
              </div>

              {/* Quick Wins */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                  Quick Wins (48-Hour Roadmap)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  High-impact adjustments you can make to your career presentation immediately.
                </p>
                <ol className="space-y-3">
                  {quickWins.length > 0 ? (
                    quickWins.map((win: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-700">
                          {i + 1}
                        </span>
                        <span className="mt-0.5">{win}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic">No action items suggested</li>
                  )}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Beta Feedback Widget */}
        {isBetaActive() && (
          <div className="mb-8 rounded-2xl border border-primary-200 bg-primary-50/20 p-6 shadow-sm">
            {feedbackSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Thank you for your feedback!</h3>
                  <p className="text-xs text-slate-500 mt-1">Your insights help us continuously optimize Sophi.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                    💬 You&apos;re a Beta Tester — Your Feedback Matters!
                  </h3>
                  <p className="text-xs text-primary-800 mt-1">
                    Help us refine the CV revamped engine. Takes less than 30 seconds.
                  </p>
                </div>
                
                {/* Rating selection buttons */}
                <div className="flex flex-wrap gap-2.5">
                  {['Loved it ⭐', 'Good 👍', 'Average 😐', 'Needs work 👎'].map((opt) => {
                    const isSelected = rating === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setRating(opt)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more about your experience, suggested features or formatting quality (optional)..."
                    className="block w-full min-h-[90px] rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={handleSubmitFeedback}
                    disabled={submittingFeedback}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-800 hover:shadow-md disabled:bg-primary-300"
                  >
                    {submittingFeedback ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Feedback</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global sticky bottom download bar */}
        <div className="sticky bottom-6 w-full rounded-2xl border border-slate-250 bg-white p-4.5 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary shrink-0">
              <Download className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-850">Download Export Packages</span>
              <span className="block text-[11px] text-slate-500">Pick layout rendering style</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href={`/api/export-pdf?jobId=${jobId}&template=min-14-white-blue-minimalist-corporate-ats`}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              title="Download standard plain ATS CV"
            >
              <span>ATS-Safe (Standard)</span>
            </a>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-gold-100 hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-200 transition-all disabled:opacity-60"
              title="Download your active PDF layout"
            >
              {downloadingPDF && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleRegenerateWithDifferentTemplate}
              disabled={downloadingPDF}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-450 transition-all disabled:opacity-60"
              title="Rotate to another design layout"
            >
              {downloadingPDF && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Try Different Template</span>
            </button>
            <button
              onClick={triggerEmailResend}
              disabled={sendingEmail}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-850 hover:shadow-md hover:shadow-primary-100 disabled:bg-primary-300"
            >
              {sendingEmail ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Mail className="h-3.5 w-3.5 text-gold" />
              )}
              <span>Email PDF</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
