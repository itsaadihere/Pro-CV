import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

// Define the structure of parsed CV elements for rendering
export interface CVElement {
  type: 'name' | 'contact' | 'header' | 'bullet' | 'text' | 'empty'
  text: string
}

// Simple rule-based line parser to map Kimi's plain text CV to PDF blocks
export function parseCVText(text: string): CVElement[] {
  const lines = text.split('\n')
  const elements: CVElement[] = []
  let isFirstLine = true

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    if (!line) {
      elements.push({ type: 'empty', text: '' })
      continue
    }

    // 1. Ignore pure box/border or divider lines
    if (/^[┌└├┤┼┴┬─═█┐┘┼┬┴┼\s-]+$/.test(line) && 
        (line.includes('┌') || line.includes('└') || line.includes('─') || line.includes('═') || line.includes('█'))) {
      continue
    }

    // 2. Strip leading/trailing box characters '│'
    if (line.startsWith('│') || line.endsWith('│')) {
      line = line.replace(/^│\s*/, '').replace(/\s*│$/, '').trim()
    }

    // Strip out markdown double asterisks globally
    line = line.replace(/\*\*/g, '').trim()

    if (!line) {
      continue
    }

    // First non-empty line is assumed to be the Name
    if (isFirstLine) {
      elements.push({ type: 'name', text: line })
      isFirstLine = false
      continue
    }

    // Contact info line check (emails, phone numbers, links, pipe separators)
    if (
      line.includes('@') ||
      line.includes('|') ||
      line.includes('+') ||
      line.toLowerCase().includes('linkedin.com') ||
      line.toLowerCase().includes('github.com')
    ) {
      elements.push({ type: 'contact', text: line })
      continue
    }

    // Section Headers (completely uppercase lines, relatively short, not starting with bullets)
    const isUppercase = line === line.toUpperCase()
    const isShort = line.length < 50
    
    // Check if line starts with any known bullet symbol
    const bulletSymbols = ['-', '•', '*', '✦', '★', '◈', '✔', '▹', '▸']
    const startsWithBullet = bulletSymbols.some(symbol => line.startsWith(symbol))

    if (isUppercase && isShort && !startsWithBullet) {
      elements.push({ type: 'header', text: line })
      continue
    }

    // Bullet points
    if (startsWithBullet) {
      // Find which symbol it starts with and strip it
      let cleanText = line
      for (const symbol of bulletSymbols) {
        if (cleanText.startsWith(symbol)) {
          cleanText = cleanText.substring(symbol.length).trim()
          break
        }
      }
      elements.push({ type: 'bullet', text: cleanText })
      continue
    }

    // Standard body text
    elements.push({ type: 'text', text: line })
  }

  return elements
}

// Styles for ATS-Safe template (Clean, standard, maximum compatibility)
const atsStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.4, color: '#333333' },
  name: { fontSize: 20, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4, color: '#000000' },
  contact: { fontSize: 9, textAlign: 'center', marginBottom: 15, color: '#555555' },
  header: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 4, textTransform: 'uppercase', color: '#000000', borderBottomWidth: 1, borderBottomColor: '#aaaaaa', paddingBottom: 2 },
  bulletContainer: { flexDirection: 'row', marginBottom: 3, paddingLeft: 10 },
  bulletPoint: { width: 8, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 9.5 },
  text: { marginBottom: 6, fontSize: 9.5, textAlign: 'justify' },
  space: { height: 6 }
})

// Styles for Modern template (Accent color, left indent, clean modern hierarchy)
const modernStyles = StyleSheet.create({
  page: { padding: 45, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.4, color: '#1e293b' },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1e3a8a', marginBottom: 2 },
  contact: { fontSize: 9, color: '#64748b', marginBottom: 18, borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 6 },
  header: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 16, marginBottom: 6, textTransform: 'uppercase', color: '#2563eb', borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 2 },
  bulletContainer: { flexDirection: 'row', marginBottom: 4, paddingLeft: 12 },
  bulletPoint: { width: 10, color: '#2563eb', fontSize: 10 },
  bulletText: { flex: 1, fontSize: 9.5, color: '#334155' },
  text: { marginBottom: 8, fontSize: 9.5, color: '#334155', textAlign: 'justify' },
  space: { height: 8 }
})

// Styles for Executive template (Elegant serif typography, formal spacing)
const executiveStyles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Times-Roman', fontSize: 10.5, lineHeight: 1.5, color: '#111111' },
  name: { fontSize: 22, fontFamily: 'Times-Bold', textAlign: 'center', marginBottom: 5, letterSpacing: 0.5 },
  contact: { fontSize: 9, fontFamily: 'Times-Italic', textAlign: 'center', marginBottom: 20, color: '#444444' },
  header: { fontSize: 11.5, fontFamily: 'Times-Bold', marginTop: 18, marginBottom: 6, textTransform: 'uppercase', textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: '#111111', paddingBottom: 2, letterSpacing: 1 },
  bulletContainer: { flexDirection: 'row', marginBottom: 4, paddingLeft: 15 },
  bulletPoint: { width: 12, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, textAlign: 'justify' },
  text: { marginBottom: 8, fontSize: 10, textAlign: 'justify' },
  space: { height: 8 }
})

// React Document Component
export const CVDocument = ({ cvText, template }: { cvText: string; template: 'ats' | 'modern' | 'executive' }) => {
  const elements = parseCVText(cvText)
  const styles = template === 'modern' ? modernStyles : template === 'executive' ? executiveStyles : atsStyles

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {elements.map((el, idx) => {
          if (el.type === 'empty') {
            return <View key={idx} style={styles.space} />
          }
          if (el.type === 'name') {
            return <Text key={idx} style={styles.name}>{el.text}</Text>
          }
          if (el.type === 'contact') {
            return <Text key={idx} style={styles.contact}>{el.text}</Text>
          }
          if (el.type === 'header') {
            return <Text key={idx} style={styles.header}>{el.text}</Text>
          }
          if (el.type === 'bullet') {
            return (
              <View key={idx} style={styles.bulletContainer}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>{el.text}</Text>
              </View>
            )
          }
          return <Text key={idx} style={styles.text}>{el.text}</Text>
        })}
      </Page>
    </Document>
  )
}

/**
 * Generates a PDF buffer of the CV using a specified template.
 */
export async function generateCVBuffer(
  cvText: string,
  template: 'ats' | 'modern' | 'executive'
): Promise<Buffer> {
  const doc = React.createElement(CVDocument, { cvText, template })
  const pdfInstance = pdf(doc as any)
  const streamOrBuffer = await pdfInstance.toBuffer()

  if (Buffer.isBuffer(streamOrBuffer)) {
    return streamOrBuffer
  }

  // If it's a stream, read it into a standard Buffer
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    const stream = streamOrBuffer as any

    if (stream && typeof stream.on === 'function') {
      stream.on('data', (chunk: any) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', (err: any) => reject(err))
    } else {
      resolve(Buffer.from(streamOrBuffer as any))
    }
  })
}
