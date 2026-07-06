import { NextRequest, NextResponse } from 'next/server'
import { generateKimiCompletion } from '@/lib/kimi'
import { getServiceSupabase } from '@/lib/supabase-server'
import { isBetaActive } from '@/lib/beta'

const KIMI_SYSTEM_PROMPT = `You are an elite CV Architect and ATS Optimization Specialist with deep expertise in modern recruitment algorithms, HR psychology, and professional branding for 2025–2026.

ROLE & MISSION:
Transform uploaded CVs into high-performance, ATS-optimized career documents that generate interviews and advance careers. Every output must be ROI-driven, quantified, and tailored to pass both automated screening systems and human review.

CORE FRAMEWORKS YOU APPLY:
1. ATS ENGINE — Score CVs across 5 dimensions: keyword density, formatting compliance, semantic relevance, skills alignment, achievement clarity.
2. STAR-METRIC BULLETS — Rewrite every bullet: Action (power verb) → Task → Result (quantified).
3. KEYWORD INTELLIGENCE — Apply industry-specific keywords. Run gap analysis vs job description.
4. 2026 PROFESSIONAL SUMMARY — 3-line formula: [Title + Years XP] | [Top 2 value props] | [Quantified proof point].
5. FORMATTING AUDIT — ATS-safe layout, no tables in headers, standard section headings.

OUTPUT STRUCTURE — always produce ALL sections in this exact order:

---ATS SCORE REPORT---
Overall: X/100
Keyword Match: X/100
Format Compliance: X/100
Achievement Density: X/100
Readability: X/100
Skills Alignment: X/100
Top 3 Issues Found:
- [issue 1]
- [issue 2]
- [issue 3]

---REVAMPED CV---
[Full rewritten CV — clean, copy-paste ready, ATS-safe]

---LINKEDIN OPTIMIZER---
Headline: [220 chars max]
About (first 3 lines): [hook-focused opener]
Top 10 Skills: [comma-separated list]

---COVER LETTER---
[JD-tailored if job description provided, otherwise achievement-driven template]

---GAP ANALYSIS---
Missing Keywords: [comma-separated]
Recommended Certifications: [list]
Quick Wins (48 hours): [3 action items]

RULES:
- Never fabricate experience, employers, or credentials not in the original CV.
- Always quantify — use ranges or "(estimated)" if exact numbers unavailable.
- Active present-tense power verbs for current role; past tense for previous.
- Output must be plain text, copy-paste ready.
- If Arabic output requested, note RTL direction at top.`

export async function POST(req: NextRequest) {
  try {
    const { cvText, industry, jobDescription, language, jobId, stylePreference = 'random' } = await req.json()

    if (!cvText || !industry || !language || !jobId) {
      return NextResponse.json(
        { error: 'Missing required parameters: cvText, industry, language, and jobId are required.' },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    // 1. Fetch current job to get the user ID
    const { data: job, error: fetchError } = await supabase
      .from('cv_jobs')
      .select('user_id')
      .eq('id', jobId)
      .single()

    if (fetchError || !job) {
      console.error('Error fetching job:', fetchError)
      return NextResponse.json({ error: 'Job not found in database.' }, { status: 404 })
    }

    const userId = job.user_id

    // Check rate limits and grant credit if beta is active
    if (isBetaActive()) {
      const { count } = await supabase
        .from('cv_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_beta_job', true)

      if ((count ?? 0) >= 2) {
        return NextResponse.json({
          error: 'Beta limit reached. Maximum 2 free CVs per user during beta.'
        }, { status: 429 })
      }

      // Upsert profile or update to ensure is_beta_user is true and cv_credits is at least 1
      const { data: profile } = await supabase
        .from('profiles')
        .select('cv_credits')
        .eq('id', userId)
        .single()

      await supabase
        .from('profiles')
        .update({
          is_beta_user: true,
          cv_credits: Math.max(profile?.cv_credits ?? 0, 1)
        })
        .eq('id', userId)
    } else {
      // Normal mode: verify user has credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('cv_credits, email')
        .eq('id', userId)
        .single()

      if (!profile || (profile.email !== 'syedsaad.mob@gmail.com' && (profile.cv_credits ?? 0) < 1)) {
        return NextResponse.json({ error: 'No credits. Please purchase.' }, { status: 403 })
      }
    }

    const userPrompt = `I am uploading my current CV for a complete AI-powered transformation.

CURRENT CV CONTENT:
${cvText}

TARGET JOB DESCRIPTION:
${jobDescription || `Not provided — optimize for general ${industry} roles`}

TARGET INDUSTRY: ${industry}
OUTPUT LANGUAGE: ${language}

Please run the full transformation and output all sections as specified in your instructions.`

    // Call Kimi AI completions
    const fullOutput = await generateKimiCompletion(KIMI_SYSTEM_PROMPT, userPrompt)

    // Parse sections
    const sections = parseKimiOutput(fullOutput)

    // Select next template using TemplateRotationEngine
    const { TemplateRotationEngine } = await import('@/lib/templateRotation')
    const rotation = new TemplateRotationEngine()
    const templateId = await rotation.getNextTemplate(userId, stylePreference)

    // 2. Update job details
    let { error: updateError } = await supabase
      .from('cv_jobs')
      .update({
        status: 'completed',
        ats_score: sections.atsScoreJson,
        generated_cv: sections.revampedCV,
        linkedin_optimizer: sections.linkedinJson,
        cover_letter: sections.coverLetter,
        gap_analysis: sections.gapAnalysisJson,
        completed_at: new Date().toISOString(),
        is_beta_job: isBetaActive(),
        template_used: templateId
      })
      .eq('id', jobId)

    if (updateError) {
      if (updateError.code === '42703' || updateError.message?.includes('template_used')) {
        console.warn('⚠️ Warning: "template_used" column not found in database. Retrying update without it. Please execute the SQL migration in "migration_history.sql" to enable template history tracking.')
        
        const fallback = await supabase
          .from('cv_jobs')
          .update({
            status: 'completed',
            ats_score: sections.atsScoreJson,
            generated_cv: sections.revampedCV,
            linkedin_optimizer: sections.linkedinJson,
            cover_letter: sections.coverLetter,
            gap_analysis: sections.gapAnalysisJson,
            completed_at: new Date().toISOString(),
            is_beta_job: isBetaActive()
          })
          .eq('id', jobId)
          
        updateError = fallback.error
      }
    }

    if (updateError) {
      console.error('Error updating job status:', updateError)
      return NextResponse.json({ error: 'Failed to update job in database.' }, { status: 500 })
    }

    // 3. Decrement user credits (only in non-beta mode)
    if (!isBetaActive()) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, cv_credits')
        .eq('id', userId)
        .single()

      if (!profileError && profile) {
        if (profile.email === 'syedsaad.mob@gmail.com') {
          await supabase
            .from('profiles')
            .update({ cv_credits: 99, has_paid: true })
            .eq('id', userId)
        } else {
          const newCredits = Math.max(0, (profile.cv_credits || 1) - 1)
          await supabase
            .from('profiles')
            .update({ cv_credits: newCredits })
            .eq('id', userId)
        }
      }
    }

    return NextResponse.json({ success: true, sections, templateId })
  } catch (error: any) {
    console.error('Error in /api/generate-cv:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during CV generation' },
      { status: 500 }
    )
  }
}

function parseKimiOutput(text: string) {
  // Regex splitting on section markers
  const atsMatch = text.match(/---ATS SCORE REPORT---([\s\S]*?)---REVAMPED CV---/)
  const cvMatch = text.match(/---REVAMPED CV---([\s\S]*?)---LINKEDIN OPTIMIZER---/)
  const linkedinMatch = text.match(/---LINKEDIN OPTIMIZER---([\s\S]*?)---COVER LETTER---/)
  const coverMatch = text.match(/---COVER LETTER---([\s\S]*?)---GAP ANALYSIS---/)
  const gapMatch = text.match(/---GAP ANALYSIS---([\s\S]*)$/)

  const atsScoreRaw = atsMatch ? atsMatch[1].trim() : ''
  const revampedCV = cvMatch ? cvMatch[1].trim() : ''
  const linkedinRaw = linkedinMatch ? linkedinMatch[1].trim() : ''
  const coverLetter = coverMatch ? coverMatch[1].trim() : ''
  const gapAnalysisRaw = gapMatch ? gapMatch[1].trim() : ''

  return {
    atsScoreJson: parseAtsScore(atsScoreRaw),
    revampedCV,
    linkedinJson: parseLinkedin(linkedinRaw),
    coverLetter,
    gapAnalysisJson: parseGapAnalysis(gapAnalysisRaw)
  }
}

function parseAtsScore(text: string) {
  const overallMatch = text.match(/Overall:\s*(\d+)/i)
  const keywordMatch = text.match(/Keyword Match:\s*(\d+)/i)
  const formatMatch = text.match(/Format Compliance:\s*(\d+)/i)
  const achievementMatch = text.match(/Achievement Density:\s*(\d+)/i)
  const readabilityMatch = text.match(/Readability:\s*(\d+)/i)
  const skillsMatch = text.match(/Skills Alignment:\s*(\d+)/i)

  const issuesList: string[] = []
  const parts = text.split(/Top 3 Issues Found:/i)
  const issuesBlock = parts.length > 1 ? parts[1] : ''
  if (issuesBlock) {
    const lines = issuesBlock.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
        issuesList.push(trimmed.replace(/^[-*\s]|\d+\.\s*/, '').trim())
      }
    }
  }

  return {
    overall: overallMatch ? parseInt(overallMatch[1]) : 70,
    keywordMatch: keywordMatch ? parseInt(keywordMatch[1]) : 70,
    formatCompliance: formatMatch ? parseInt(formatMatch[1]) : 70,
    achievementDensity: achievementMatch ? parseInt(achievementMatch[1]) : 70,
    readability: readabilityMatch ? parseInt(readabilityMatch[1]) : 70,
    skillsAlignment: skillsMatch ? parseInt(skillsMatch[1]) : 70,
    issues: issuesList.slice(0, 3)
  }
}

function parseLinkedin(text: string) {
  const headlineMatch = text.match(/Headline:\s*([^\n]+)/i)
  const aboutMatch = text.match(/About \(first 3 lines\):\s*([\s\S]*?)(?=Top 10 Skills:|$)/i)
  const skillsMatch = text.match(/Top 10 Skills:\s*([^\n]+)/i)

  let skills: string[] = []
  if (skillsMatch) {
    skills = skillsMatch[1].split(',').map(s => s.trim()).filter(Boolean)
  }

  return {
    headline: headlineMatch ? headlineMatch[1].trim() : '',
    about: aboutMatch ? aboutMatch[1].trim() : '',
    skills: skills.slice(0, 10)
  }
}

function parseGapAnalysis(text: string) {
  const missingKeywordsMatch = text.match(/Missing Keywords:\s*([^\n]+)/i)
  const certsMatch = text.match(/Recommended Certifications:\s*([\s\S]*?)(?=Quick Wins|$)/i)
  const winsMatch = text.match(/Quick Wins \(48 hours\):\s*([\s\S]*)$/i)

  let missingKeywords: string[] = []
  if (missingKeywordsMatch) {
    missingKeywords = missingKeywordsMatch[1].split(',').map(k => k.trim()).filter(Boolean)
  }

  let certifications: string[] = []
  if (certsMatch) {
    certifications = certsMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))
      .map(line => line.replace(/^[-*\s]|\d+\.\s*/, '').trim())
  }

  let quickWins: string[] = []
  if (winsMatch) {
    quickWins = winsMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))
      .map(line => line.replace(/^[-*\s]|\d+\.\s*/, '').trim())
  }

  return {
    missingKeywords,
    certifications,
    quickWins
  }
}
