'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowRight, BookOpen, AlertCircle, FileText, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

import Header from '@/components/Header'
import UploadZone from '@/components/UploadZone'
import PaymentGate from '@/components/PaymentGate'

const INDUSTRIES = [
  'Tech',
  'Finance',
  'Marketing',
  'Healthcare',
  'Legal',
  'Engineering',
  'Sales',
  'HR',
  'Operations',
  'Education',
  'Consulting',
  'Design',
]

const LANGUAGES = [
  { code: 'EN', label: 'English (EN)' },
  { code: 'AR', label: 'Arabic (AR)' },
  { code: 'FR', label: 'French (FR)' },
  { code: 'ES', label: 'Spanish (ES)' },
]

const PIPELINE_STEPS = [
  { id: 1, label: 'Uploading original CV file...' },
  { id: 2, label: 'Extracting text and formatting...' },
  { id: 3, label: 'AI rewriting & ATS scoring...' },
  { id: 4, label: 'Generating PDF templates...' },
  { id: 5, label: 'Sending copy to your email...' },
]

export default function UploadPage() {
  const router = useRouter()
  const supabase = getClientSupabase()

  // Guard states
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Form states
  const [file, setFile] = useState<File | null>(null)
  const [industry, setIndustry] = useState('Tech')
  const [jobDescription, setJobDescription] = useState('')
  const [language, setLanguage] = useState('EN')
  const [stylePreference, setStylePreference] = useState<'modern' | 'minimalist' | 'random'>('modern')

  // Processing states
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please login to access this page')
        router.push('/login')
        return
      }

      setUserId(session.user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('cv_credits')
        .eq('id', session.user.id)
        .single()

      if (session.user.email === 'syedsaad.mob@gmail.com') {
        setCredits(99)
      } else if (profile) {
        setCredits(profile.cv_credits)
      } else {
        setCredits(0)
      }
      setLoadingProfile(false)
    }

    loadProfile()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please upload your CV file (PDF or DOCX)')
      return
    }

    setProcessing(true)
    setCurrentStep(1)
    setProgressPercent(10)

    try {
      // Step 1: Upload file to Supabase Storage
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filePath = `cv-uploads/${userId}/${timestamp}.${extension}`

      // Attempt client-side upload to standard bucket 'cv-uploads'
      // Note: We upload raw buffer. If the bucket doesn't exist, we will catch and log.
      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) {
        console.warn('Supabase storage upload failed or bucket does not exist. Proceeding directly with parsing stream.')
      }

      // Step 2: Create cv_job entry in DB
      setProgressPercent(25)
      const { data: job, error: jobError } = await supabase
        .from('cv_jobs')
        .insert({
          user_id: userId,
          status: 'processing',
          original_file_path: filePath,
          target_industry: industry,
          target_job_description: jobDescription,
          output_language: language,
        })
        .select('id')
        .single()

      if (jobError || !job) {
        throw new Error('Failed to initialize transformation job in database.')
      }

      const jobId = job.id

      // Step 3: Parse CV
      setCurrentStep(2)
      setProgressPercent(40)
      const formData = new FormData()
      formData.append('file', file)

      const parseRes = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      })

      const parseData = await parseRes.json()
      if (!parseRes.ok || !parseData.text) {
        throw new Error(parseData.error || 'Failed to extract text from your CV document.')
      }

      const cvText = parseData.text

      // Step 4: Generate CV using AI
      setCurrentStep(3)
      setProgressPercent(60)

      const generateRes = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvText,
          industry,
          jobDescription,
          language,
          jobId,
          stylePreference,
        }),
      })

      const generateData = await generateRes.json()
      if (!generateRes.ok || !generateData.success) {
        throw new Error(generateData.error || 'AI optimization failed.')
      }

      // Step 5: Generating PDF template
      setCurrentStep(4)
      setProgressPercent(75)

      const exportRes = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          templateId: generateData.templateId
        }),
      })

      if (!exportRes.ok) {
        throw new Error('Failed to generate PDF template.')
      }

      // Step 6: Email the generated CV PDF to the user
      setCurrentStep(5)
      setProgressPercent(90)

      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
        }),
      })

      setProgressPercent(100)
      toast.success('Your CV revamp is complete! Redirecting to results dashboard...')
      
      // Delay redirection briefly for UX completion feel
      setTimeout(() => {
        router.push(`/result/${jobId}`)
      }, 1000)

    } catch (err: any) {
      console.error('Error executing upload transformation pipeline:', err)
      toast.error(err.message || 'Transformation failed. Please try again.')
      setProcessing(false)
      setCurrentStep(0)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <PaymentGate credits={credits} loading={loadingProfile}>
          <div className="space-y-8">
            {/* Header Title */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Transform Your CV
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Configure your career preferences below and upload your current CV. Our AI will handle the rest.
              </p>
            </div>

            {processing ? (
              /* Loading pipeline screen */
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 animate-pulse">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">Processing Your CV Transformation</h3>
                  <p className="text-xs text-slate-500">This takes about 45-60 seconds. Please do not close or refresh this tab.</p>
                </div>

                {/* Progress bar container */}
                <div className="max-w-md mx-auto space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>

                {/* Pipeline Steps Tracker */}
                <div className="max-w-md mx-auto text-left border-t border-slate-100 pt-6 space-y-3.5">
                  {PIPELINE_STEPS.map((step) => {
                    const isActive = currentStep === step.id
                    const isCompleted = currentStep > step.id
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 text-sm font-semibold transition-all ${
                          isActive
                            ? 'text-primary'
                            : isCompleted
                            ? 'text-gold'
                            : 'text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />
                        ) : isActive ? (
                          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-205 text-[10px] text-slate-400 font-bold shrink-0">
                            {step.id}
                          </div>
                        )}
                        <span className={isActive ? 'font-extrabold' : 'font-medium'}>{step.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Upload Form */
              <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-3">
                {/* File Dropzone - Left */}
                <div className="md:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 mb-4">Original CV Document</h3>
                    <UploadZone onFileSelected={setFile} selectedFile={file} />
                  </div>

                  {/* Tailor Config - Left Bottom */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 font-bold text-slate-850">
                      <BookOpen className="h-4.5 w-4.5 text-blue-500" />
                      <span>Target Job Description (Optional)</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-3">
                        Paste the target job posting to allow our AI to run a custom semantic keywords gap analysis and tailor your experience bullet points specifically to this job description.
                      </p>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste job title, responsibilities, requirements, and keywords here..."
                        className="block w-full min-h-[160px] rounded-xl border border-slate-350 bg-white p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Configurations Sidebar - Right */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                      Optimization Options
                    </h3>

                    {/* Target Industry */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Target Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Output Language */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Output Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>



                    {/* Action Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100"
                      >
                        <span>Transform My CV</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Warning banner */}
                  <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-xs text-blue-900">
                    <AlertCircle className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Transforming your CV consumes <strong>1 credit</strong>. Make sure your uploaded file contains your correct work experience.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </PaymentGate>
      </main>
    </div>
  )
}
