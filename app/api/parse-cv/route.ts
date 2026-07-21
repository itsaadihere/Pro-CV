import { NextRequest, NextResponse } from 'next/server'
import { parsePdf, parseDocx } from '@/lib/parsers'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = (formData as any).get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      text = await parsePdf(buffer)
    } else if (
      file.type.includes('wordprocessingml') ||
      file.name.toLowerCase().endsWith('.docx')
    ) {
      text = await parseDocx(buffer)
    } else {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ text: text.trim() })
  } catch (error: any) {
    console.error('Error in /api/parse-cv:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during parsing' },
      { status: 500 }
    )
  }
}
