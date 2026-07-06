import { NextRequest, NextResponse } from 'next/server'
import { formatCVWithGemini } from '@/lib/gemini'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { cvText, template } = await req.json()

    if (!cvText) {
      return NextResponse.json({ error: 'Missing cvText parameter' }, { status: 400 })
    }

    if (!template) {
      return NextResponse.json({ error: 'Missing template parameter' }, { status: 400 })
    }

    // Attempt to format with Gemini
    const formattedText = await formatCVWithGemini(cvText, template)

    return NextResponse.json({ 
      formattedText: formattedText || cvText,
      isGeminiOptimized: !!formattedText
    })
  } catch (error: any) {
    console.error('Error in /api/format-cv:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during formatting' },
      { status: 500 }
    )
  }
}
