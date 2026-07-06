export interface CVData {
  // Personal
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  website?: string

  // Sections
  summary: string
  coreCompetencies: string[]

  experience: Array<{
    title: string
    company: string
    location?: string
    startDate: string
    endDate: string
    bullets: string[]
  }>

  keyAchievements: string[]

  education: Array<{
    degree: string
    institution: string
    startYear: string
    endYear: string
    distinction?: string
  }>

  certifications: Array<{
    name: string
    issuer: string
    year: string
  }>

  technicalSkills: Record<string, string[]> // { "Software": ["Excel", "SAP"], ... }
  languages: Array<{ language: string; level: string }>
  interests?: string[]
  volunteerWork?: Array<{ role: string; org: string; period: string; description: string }>
  references?: Array<{ name: string; title: string; contact: string }>
}

export function parseKimiCV(kimiOutput: string): CVData {
  // Extract the REVAMPED CV section
  const cvSection = kimiOutput
    .match(/---REVAMPED CV---([\s\S]*?)---LINKEDIN OPTIMIZER---/)?.[1]?.trim() ?? kimiOutput

  // Parse name — first line of CV section, usually ALL CAPS
  const lines = cvSection.split('\n').filter(l => l.trim())

  // --- Parse each field using regex patterns ---
  // Name: First non-empty line (usually ALL CAPS block)
  const fullName = lines[0]?.replace(/^[█\s#─═┌└┐┘│*]+|[█\s#─═┌└┐┘│*]+$/g, '').trim() ?? ''

  // Job title: Second line
  const jobTitle = lines[1]?.replace(/^[#\s\-*]+|[#\s\-*]+$/g, '').trim() ?? ''

  // Contact line: Find line containing @ symbol
  const contactLine = lines.find(l => l.includes('@')) ?? ''
  const email = contactLine.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i)?.[0] ?? ''
  const phone = contactLine.match(/[\+\d][\d\s\-\(\)]{7,}/)?.[0]?.trim() ?? ''
  const linkedin = contactLine.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] ?? ''
  const location = contactLine.match(/📍\s*([^|]+)/)?.[1]?.trim()
    ?? contactLine.split('|').find(p => p.includes(','))?.trim() ?? ''

  // Summary: Text after PROFESSIONAL SUMMARY header
  const summaryMatch = cvSection.match(
    /(?:PROFESSIONAL SUMMARY|SUMMARY)[═\s\n\-#_*]+([\s\S]+?)(?=CORE COMPETENCIES|PROFESSIONAL EXPERIENCE|EXPERIENCE|════)/i
  )
  const summary = summaryMatch?.[1]?.replace(/[▸✦★◈✔•*\-]/g, '').trim() ?? ''

  // Core Competencies: Lines with ▸ bullets in competencies block
  const competenciesBlock = cvSection.match(
    /(?:CORE COMPETENCIES|KEY COMPETENCIES|COMPETENCIES)[═\s\n\-#_*]+([\s\S]+?)(?=PROFESSIONAL EXPERIENCE|EXPERIENCE|════)/i
  )?.[1] ?? ''
  
  const coreCompetencies = competenciesBlock
    .split(/[\n▸✦★◈✔•*\-]/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 50)

  // Experience: Parse job blocks between ┌─ and next ┌─ or section header
  const experienceBlocks = cvSection.match(
    /┌─+┐[\s\S]+?└─+┘[\s\S]*?(?=┌─+┐|════|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|$)/g
  ) ?? []

  let experience = experienceBlocks.map(block => {
    const headerLine = block.match(/│\s*(.+?)\s*│/)?.[1]?.trim() ?? ''
    const [titlePart, companyPart] = headerLine.split('—').map(s => s.trim())
    const dateLine = block.match(/│[^│]*(\w+ \d{4})\s*[–-]\s*(\w+ \d{4}|Present)[^│]*│/i)
    const bullets = block.match(/✦\s*(.+)/g)?.map(b => b.replace('✦', '').trim()) ?? []

    return {
      title: titlePart ?? '',
      company: companyPart ?? '',
      startDate: dateLine?.[1] ?? '',
      endDate: dateLine?.[2] ?? '',
      bullets
    }
  })

  // If experience blocks are empty, try fallback parsing (e.g. without ┌─ box drawing lines)
  if (experience.length === 0) {
    const expSectionMatch = cvSection.match(
      /(?:PROFESSIONAL EXPERIENCE|EXPERIENCE|WORK EXPERIENCE)[═\s\n\-#_*]+([\s\S]+?)(?=EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════|$)/i
    )
    if (expSectionMatch) {
      const expText = expSectionMatch[1]
      // Split by double newlines or lines starting with role/company patterns
      const jobs = expText.split(/(?=\n[A-Za-z0-9\s,&]+—[A-Za-z0-9\s,&]+)/)
      experience = jobs.map(jobBlock => {
        const lines = jobBlock.split('\n').map(l => l.trim()).filter(Boolean)
        if (lines.length === 0) return null
        
        const header = lines[0]
        const [titlePart, companyPart] = header.split('—').map(s => s.trim())
        const dateMatch = jobBlock.match(/(\w+ \d{4})\s*[–-]\s*(\w+ \d{4}|Present)/i)
        const bullets = lines.filter(l => /^[✦*•\-▸]/.test(l)).map(l => l.replace(/^[✦*•\-▸]\s*/, '').trim())
        
        return {
          title: titlePart ?? '',
          company: companyPart ?? '',
          startDate: dateMatch?.[1] ?? '',
          endDate: dateMatch?.[2] ?? '',
          bullets
        }
      }).filter(Boolean) as any[]
    }
  }

  // Key Achievements: ★ bullet lines
  const keyAchievements = cvSection.match(/★\s*(.+)/g)
    ?.map(a => a.replace('★', '').trim()) ?? []

  // Education: ◈ bullet blocks
  const educationBlocks = cvSection.match(/◈\s*([\s\S]+?)(?=◈|════|CERTIFICATIONS|TECHNICAL SKILLS|Languages|$)/g) ?? []
  const education = educationBlocks.map(block => {
    const eduLines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const degree = eduLines[0]?.replace('◈', '').trim() ?? ''
    const institution = eduLines[1] ?? ''
    const years = block.match(/(\d{4})\s*[–-]\s*(\d{4})/)
    return {
      degree,
      institution,
      startYear: years?.[1] ?? '',
      endYear: years?.[2] ?? '',
    }
  })

  if (education.length === 0) {
    const eduSectionMatch = cvSection.match(
      /(?:EDUCATION)[═\s\n\-#_*]+([\s\S]+?)(?=CERTIFICATIONS|TECHNICAL SKILLS|LANGUAGES|════|$)/i
    )
    if (eduSectionMatch) {
      const eduText = eduSectionMatch[1]
      const eduLines = eduText.split('\n').map(l => l.trim()).filter(Boolean)
      let currentDegree = ''
      let currentInst = ''
      let startY = ''
      let endY = ''
      for (const l of eduLines) {
        if (/^[A-Za-z]/.test(l)) {
          if (l.includes(',') || l.includes('—')) {
            const parts = l.split(/[,—]/).map(s => s.trim())
            currentDegree = parts[0]
            currentInst = parts[1] || ''
          } else {
            currentDegree = l
          }
          const years = l.match(/(\d{4})\s*[–-]\s*(\d{4})/)
          if (years) {
            startY = years[1]
            endY = years[2]
          }
          education.push({ degree: currentDegree, institution: currentInst, startYear: startY, endYear: endY })
        }
      }
    }
  }

  // Certifications: ✔ bullet lines
  const certLines = cvSection.match(/✔\s*(.+)/g) ?? []
  let certifications = certLines.map(line => {
    const clean = line.replace('✔', '').trim()
    const parts = clean.split('—')
    const yearMatch = clean.match(/\d{4}/)
    return {
      name: parts[0]?.trim() ?? clean,
      issuer: parts[1]?.replace(/\d{4}/, '').trim() ?? '',
      year: yearMatch?.[0] ?? ''
    }
  })

  if (certifications.length === 0) {
    const certSectionMatch = cvSection.match(
      /(?:CERTIFICATIONS)[═\s\n\-#_*]+([\s\S]+?)(?=TECHNICAL SKILLS|LANGUAGES|════|$)/i
    )
    if (certSectionMatch) {
      const certText = certSectionMatch[1]
      const lines = certText.split('\n').map(l => l.trim()).filter(Boolean)
      certifications = lines.map(l => {
        const parts = l.split(/[—,]/).map(s => s.trim())
        const yearMatch = l.match(/\d{4}/)
        return {
          name: parts[0] || l,
          issuer: parts[1] || '',
          year: yearMatch?.[0] || ''
        }
      })
    }
  }

  // Technical Skills: Category: skill | skill format
  const skillsBlock = cvSection.match(
    /(?:TECHNICAL SKILLS|SKILLS)[═\s\n\-#_*]+([\s\S]+?)(?=VOLUNTEER|INTERESTS|REFERENCES|LANGUAGES|────|$)/i
  )?.[1] ?? ''
  const technicalSkills: Record<string, string[]> = {}
  skillsBlock.split('\n').forEach(line => {
    const match = line.match(/(.+?)\s*:\s*(.+)/)
    if (match) {
      const category = match[1].trim()
      const skills = match[2].split('|').map(s => s.trim()).filter(Boolean)
      technicalSkills[category] = skills
    }
  })

  // Languages
  const langBlock = cvSection.match(/Languages\s*:\s*(.+)/i)?.[1] ?? ''
  const languages = langBlock.split('|').map(l => {
    const parts = l.trim().split(':')
    return { language: parts[0]?.trim() ?? l.trim(), level: parts[1]?.trim() ?? 'Professional' }
  }).filter(l => l.language.length > 0)

  return {
    fullName, jobTitle, email, phone, location, linkedin,
    summary, coreCompetencies, experience, keyAchievements,
    education, certifications, technicalSkills, languages
  }
}
