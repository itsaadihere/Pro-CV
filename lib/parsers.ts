import mammoth from 'mammoth'
const pdf = require('pdf-parse')

/**
 * Extracts raw text from a PDF Buffer using pdf-parse.
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer)
    return data.text || ''
  } catch (error: any) {
    console.error('Error parsing PDF:', error)
    throw new Error(`Failed to parse PDF file: ${error.message || error}`)
  }
}

/**
 * Extracts raw text from a DOCX Buffer using mammoth.
 */
export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (error) {
    console.error('Error parsing DOCX:', error)
    throw new Error('Failed to parse DOCX file. Ensure it is not corrupted.')
  }
}
