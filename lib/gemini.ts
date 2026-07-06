import fs from 'fs'
import path from 'path'

/**
 * Helper to pick a random template from the specified category folder
 * while ensuring no repetitions until all templates have been used.
 */
function getRandomTemplate(templateType: 'modern' | 'minimalist'): { filePath: string; fileName: string } | null {
  try {
    const templatesDir = path.join(process.cwd(), 'CV Templates')
    const folderName = templateType === 'modern' ? 'Modern' : 'Minimalist'
    const folderPath = path.join(templatesDir, folderName)

    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️ Template folder not found: ${folderPath}`)
      return null
    }

    // Read all PDF files in the category directory
    const files = fs.readdirSync(folderPath).filter(file => file.toLowerCase().endsWith('.pdf'))
    if (files.length === 0) {
      console.warn(`⚠️ No PDF files found in: ${folderPath}`)
      return null
    }

    // Load history of used templates
    const historyPath = path.join(templatesDir, 'template_history.json')
    let history: Record<string, string[]> = { modern: [], minimalist: [] }

    if (fs.existsSync(historyPath)) {
      try {
        const fileContent = fs.readFileSync(historyPath, 'utf-8')
        history = JSON.parse(fileContent)
        if (!history.modern) history.modern = []
        if (!history.minimalist) history.minimalist = []
      } catch (e) {
        console.error('⚠️ Error reading template history file:', e)
      }
    }

    const usedList = templateType === 'modern' ? history.modern : history.minimalist

    // Filter out templates that have already been used
    let unusedFiles = files.filter(f => !usedList.includes(f))

    // If all templates in the folder have been used, reset the history for this folder
    if (unusedFiles.length === 0) {
      unusedFiles = files
      if (templateType === 'modern') {
        history.modern = []
      } else {
        history.minimalist = []
      }
    }

    // Pick a random unused file
    const chosenFile = unusedFiles[Math.floor(Math.random() * unusedFiles.length)]

    // Record it as used in history
    if (templateType === 'modern') {
      history.modern.push(chosenFile)
    } else {
      history.minimalist.push(chosenFile)
    }

    // Write back updated history
    try {
      fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8')
    } catch (e) {
      console.error('⚠️ Error saving template history file:', e)
    }

    return {
      filePath: path.join(folderPath, chosenFile),
      fileName: chosenFile
    }
  } catch (error) {
    console.error(`❌ Error picking random template for ${templateType}:`, error)
    return null
  }
}

/**
 * Uses Gemini API to format and structure raw CV text specifically for a target layout template.
 * For modern and minimalist, uploads a template PDF to copy its formatting.
 * Returns the optimized text, or null if the key is not set or the request fails.
 */
export async function formatCVWithGemini(
  cvText: string,
  template: 'ats' | 'modern' | 'minimalist'
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey === 'your_gemini_key_here' || apiKey.includes('placeholder')) {
    console.warn('⚠️ GEMINI API KEY not set. Bypassing template formatting.')
    return null
  }

  let pdfBase64: string | null = null
  let selectedFileDetails: { filePath: string; fileName: string } | null = null

  // 1. Select and load PDF template for Modern or Minimalist layouts
  if (template === 'modern' || template === 'minimalist') {
    selectedFileDetails = getRandomTemplate(template)
    if (selectedFileDetails) {
      try {
        const fileBuffer = fs.readFileSync(selectedFileDetails.filePath)
        pdfBase64 = fileBuffer.toString('base64')
        console.log(`📄 Gemini uploaded template: "${selectedFileDetails.fileName}"`)
      } catch (err) {
        console.error(`⚠️ Failed to read PDF template file:`, err)
      }
    }
  }

  // 2. Build the query payload structure
  let prompt = ''
  const contentsParts: any[] = []

  if (template === 'ats') {
    // ATS text-only instructions
    prompt = `You are a professional resume designer.
Reflect the text-based CV provided below. Ensure standard single-column ATS-friendly formatting and clear headers (e.g., WORK EXPERIENCE, EDUCATION, SKILLS) for maximum ATS scanner readability.
Do NOT use any visual CV templates or layout sidebars. Use only clean plain text.

Candidate details from Kimi AI:
${cvText}`

    contentsParts.push({ text: prompt })
  } else {
    // Modern or Minimalist template mapping
    if (pdfBase64 && selectedFileDetails) {
      prompt = `You are a professional resume designer.
We have provided a PDF template: "${selectedFileDetails.fileName}".

Your task:
1. Analyze the exact layout structure, spacing, section ordering, typography styles, and bullet patterns of the provided PDF template.
2. Remove all dummy details and placeholder details present inside the template.
3. Replace them with the actual candidate details provided below (which were generated by Kimi AI).
4. Strictly replicate the structure of the selected template. Do not create any custom CV layout or formatting on your own.
5. Return ONLY the finalized CV text formatted to match the template. Do not add any conversational introductions, markdown blocks, notes, or explanations. The output must start directly with the candidate's name.

Candidate details from Kimi AI:
${cvText}`

      contentsParts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64
        }
      })
      contentsParts.push({ text: prompt })
    } else {
      // Fallback if template files fail to load
      const isModern = template === 'modern'
      prompt = `You are a professional resume designer. Take the following revamped CV text and format/structure it to fit a clean, elegant "${template.toUpperCase()}" template.
${isModern ? 'Ensure side columns for contact, skills, and education, and main columns for experience.' : 'Ensure clean minimalist vertical structure.'}

Return ONLY the formatted CV text starting directly with the candidate's name.

Candidate details:
${cvText}`
      contentsParts.push({ text: prompt })
    }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000) // 12s timeout for PDF upload response

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: contentsParts }],
          generationConfig: {
            temperature: 0.1, // low temperature for high layout precision
          }
        }),
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`❌ Gemini API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text
    return textOutput ? textOutput.trim() : null
  } catch (error) {
    console.error('❌ Error communicating with Gemini API:', error)
    return null
  }
}
