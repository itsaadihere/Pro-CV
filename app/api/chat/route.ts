import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const historyJson = formData.get('history') as string
    const text = formData.get('text') as string | null
    const audioBlob = formData.get('audio') as Blob | null

    const history = historyJson ? JSON.parse(historyJson) : []
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    // System prompt setting the behavior of the interview bot
    const systemPrompt = `You are an expert AI CV builder assistant named Gemini.
Your job is to conduct an interactive interview with the user to gather all necessary information to create a professional CV.
Ask one or two questions at a time. Keep it conversational and encouraging.
Gather:
1. Contact info (if missing)
2. Professional summary / objective
3. Work experience (titles, companies, dates, key achievements)
4. Education
5. Skills
If the user provides a LinkedIn URL, acknowledge it and say you will use it.
If the user sends a voice note, it will be transcribed in their message. 

When you believe you have gathered enough information to generate a solid baseline CV (at least 1 recent job, education, skills, and summary), you MUST append this EXACT string to the end of your response:
"[COMPLETE_CV]"
Followed by a markdown block containing the structured CV text you've compiled based on their answers.`

    // Construct the contents array for Gemini
    const contents: any[] = []

    // Add history (we map 'assistant' to 'model')
    for (const msg of history) {
      if (msg.role === 'assistant') {
        contents.push({ role: 'model', parts: [{ text: msg.content }] })
      } else {
        // User history
        contents.push({ role: 'user', parts: [{ text: msg.content }] })
      }
    }

    // Prepare current message parts
    const currentParts: any[] = []

    if (text) {
      currentParts.push({ text })
    }

    if (audioBlob) {
      const buffer = await audioBlob.arrayBuffer()
      const base64Data = Buffer.from(buffer).toString('base64')
      currentParts.push({
        inlineData: {
          data: base64Data,
          mimeType: audioBlob.type || 'audio/webm'
        }
      })
      currentParts.push({ text: "Please transcribe this audio and respond to it." })
    }

    if (currentParts.length > 0) {
      contents.push({ role: 'user', parts: currentParts })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    })

    const reply = response.text || ''
    
    // Check if the AI decided it has enough info
    let isComplete = false
    let cvData = ''
    let cleanReply = reply

    if (reply.includes('[COMPLETE_CV]')) {
      isComplete = true
      const parts = reply.split('[COMPLETE_CV]')
      cleanReply = parts[0].trim()
      cvData = parts[1].trim()
    }

    return NextResponse.json({
      reply: cleanReply,
      isComplete,
      cvData
    })

  } catch (error: any) {
    console.error('Error in chat route:', error)
    return NextResponse.json({ error: error.message || 'Failed to process chat request' }, { status: 500 })
  }
}
