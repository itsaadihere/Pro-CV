import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const { url, idealProfile } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'LinkedIn URL is required' }, { status: 400 })
    }

    const proxycurlKey = process.env.PROXYCURL_API_KEY
    let currentProfileText = ''

    if (proxycurlKey) {
      // Use Proxycurl if available
      const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}`, {
        headers: { 'Authorization': `Bearer ${proxycurlKey}` }
      })
      if (response.ok) {
        const data = await response.json()
        currentProfileText = `Name: ${data.full_name}\nHeadline: ${data.headline}\nSummary: ${data.summary}\nExperiences: ${JSON.stringify(data.experiences)}`
      } else {
        console.warn('Proxycurl fetch failed:', await response.text())
        currentProfileText = 'Failed to fetch live LinkedIn data. Assuming basic default profile for contrast.'
      }
    } else {
      // Mocked if no key provided
      currentProfileText = `(Mocked Live Data)\nHeadline: Software Engineer\nSummary: Passionate about coding.\nSkills: JS, React`
    }

    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey })
    
    const prompt = `You are a LinkedIn Optimization Expert.
We have an IDEAL profile layout we generated for the user based on their CV:
---
Headline: ${idealProfile.headline}
Summary: ${idealProfile.about}
Top Skills: ${idealProfile.skills?.join(', ')}
---

And here is their CURRENT live LinkedIn profile data we just fetched:
---
${currentProfileText}
---

Please generate a Contrast Report. Compare what they currently have versus what they need to have (the ideal). 
Structure it clearly with sections: 
1. Headline Contrast & Suggestion
2. Summary Contrast & Suggestion
3. Skills Contrast
Make it actionable so they can copy-paste to update their profile.`

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    return NextResponse.json({
      success: true,
      contrastReport: result.text
    })

  } catch (error: any) {
    console.error('LinkedIn analyze error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
