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

// Dynamic style generator for all templates and color combinations
export function getStylesForTemplate(template: string, theme: string) {
  let colors = {
    primary: '#000000',
    secondary: '#555555',
    accent: '#aaaaaa',
    text: '#333333',
    bg: '#ffffff',
    headerText: '#000000'
  }

  if (template === 'ats') {
    if (theme === 'navy') {
      colors = { primary: '#0f172a', secondary: '#555555', accent: '#94a3b8', text: '#334155', bg: '#ffffff', headerText: '#0f172a' }
    } else if (theme === 'charcoal') {
      colors = { primary: '#27272a', secondary: '#555555', accent: '#d4d4d8', text: '#3f3f46', bg: '#ffffff', headerText: '#27272a' }
    } else { // classic
      colors = { primary: '#000000', secondary: '#555555', accent: '#aaaaaa', text: '#333333', bg: '#ffffff', headerText: '#000000' }
    }
    return StyleSheet.create({
      page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.4, color: colors.text, backgroundColor: colors.bg },
      name: { fontSize: 20, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4, color: colors.primary },
      contact: { fontSize: 9, textAlign: 'center', marginBottom: 15, color: colors.secondary },
      header: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 4, textTransform: 'uppercase', color: colors.primary, borderBottomWidth: 1, borderBottomColor: colors.accent, paddingBottom: 2 },
      bulletContainer: { flexDirection: 'row', marginBottom: 3, paddingLeft: 10 },
      bulletPoint: { width: 8, fontSize: 10, color: colors.primary },
      bulletText: { flex: 1, fontSize: 9.5, color: colors.text },
      text: { marginBottom: 6, fontSize: 9.5, textAlign: 'justify', color: colors.text },
      space: { height: 6 }
    })
  }

  if (template === 'modern') {
    if (theme === 'gold') {
      colors = { primary: '#0f2b48', secondary: '#334155', accent: '#c5a059', text: '#1e293b', bg: '#ffffff', headerText: '#0f2b48' }
    } else if (theme === 'purple') {
      colors = { primary: '#4c1d95', secondary: '#334155', accent: '#7c3aed', text: '#1e293b', bg: '#ffffff', headerText: '#4c1d95' }
    } else { // blue
      colors = { primary: '#1e3a8a', secondary: '#334155', accent: '#2563eb', text: '#1e293b', bg: '#ffffff', headerText: '#1e3a8a' }
    }
    return StyleSheet.create({
      page: { padding: 35, fontFamily: 'Helvetica', fontSize: 9, lineHeight: 1.35, color: colors.text, backgroundColor: colors.bg },
      headerSection: { borderBottomWidth: 1, borderBottomColor: colors.accent, paddingBottom: 10, marginBottom: 15 },
      name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: colors.primary, marginBottom: 2 },
      contact: { fontSize: 8.5, color: colors.secondary },
      columnsContainer: { flexDirection: 'row', flex: 1 },
      leftColumn: { width: '32%', borderRightWidth: 0.5, borderRightColor: colors.accent, paddingRight: 12, marginRight: 12 },
      rightColumn: { width: '68%' },
      header: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', marginTop: 12, marginBottom: 5, textTransform: 'uppercase', color: colors.primary, borderBottomWidth: 0.5, borderBottomColor: colors.accent, paddingBottom: 2 },
      bulletContainer: { flexDirection: 'row', marginBottom: 3, paddingLeft: 8 },
      bulletPoint: { width: 8, color: colors.accent, fontSize: 9 },
      bulletText: { flex: 1, fontSize: 8.5, color: colors.text },
      text: { marginBottom: 5, fontSize: 8.5, color: colors.text, textAlign: 'justify' },
      space: { height: 6 }
    })
  }

  if (template === 'executive') {
    if (theme === 'burgundy') {
      colors = { primary: '#4c0519', secondary: '#475569', accent: '#9f1239', text: '#111111', bg: '#ffffff', headerText: '#4c0519' }
    } else if (theme === 'navy') {
      colors = { primary: '#0f172a', secondary: '#334155', accent: '#1e3a8a', text: '#111111', bg: '#ffffff', headerText: '#0f172a' }
    } else { // classic
      colors = { primary: '#111111', secondary: '#444444', accent: '#111111', text: '#111111', bg: '#ffffff', headerText: '#111111' }
    }
    return StyleSheet.create({
      page: { padding: 50, fontFamily: 'Times-Roman', fontSize: 10.5, lineHeight: 1.5, color: colors.text, backgroundColor: colors.bg },
      name: { fontSize: 22, fontFamily: 'Times-Bold', textAlign: 'center', marginBottom: 5, color: colors.primary, letterSpacing: 0.5 },
      contact: { fontSize: 9, fontFamily: 'Times-Italic', textAlign: 'center', marginBottom: 20, color: colors.secondary },
      header: { fontSize: 11.5, fontFamily: 'Times-Bold', marginTop: 18, marginBottom: 6, textTransform: 'uppercase', textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.accent, paddingBottom: 2, color: colors.primary, letterSpacing: 1 },
      bulletContainer: { flexDirection: 'row', marginBottom: 4, paddingLeft: 15 },
      bulletPoint: { width: 12, fontSize: 10, color: colors.primary },
      bulletText: { flex: 1, fontSize: 10, textAlign: 'justify', color: colors.text },
      text: { marginBottom: 8, fontSize: 10, textAlign: 'justify', color: colors.text },
      space: { height: 8 }
    })
  }

  if (template === 'minimalist') {
    if (theme === 'warm') {
      colors = { primary: '#451a03', secondary: '#78350f', accent: '#f59e0b', text: '#451a03', bg: '#fafaf9', headerText: '#451a03' }
    } else if (theme === 'gold') {
      colors = { primary: '#0f2b48', secondary: '#664523', accent: '#c5a059', text: '#1e293b', bg: '#faf8f4', headerText: '#0f2b48' }
    } else { // charcoal
      colors = { primary: '#27272a', secondary: '#52525b', accent: '#71717a', text: '#27272a', bg: '#fafafa', headerText: '#27272a' }
    }
    return StyleSheet.create({
      page: { padding: 45, fontFamily: 'Helvetica', fontSize: 9.5, lineHeight: 1.45, color: colors.text, backgroundColor: colors.bg },
      name: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: colors.primary, marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' },
      contact: { fontSize: 8.5, textAlign: 'center', color: colors.secondary, marginBottom: 20 },
      header: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 16, marginBottom: 8, textTransform: 'uppercase', color: colors.primary, letterSpacing: 1.5, textAlign: 'left', borderBottomWidth: 0.5, borderBottomColor: colors.accent, paddingBottom: 2 },
      bulletContainer: { flexDirection: 'row', marginBottom: 3.5, paddingLeft: 8 },
      bulletPoint: { width: 8, color: colors.secondary, fontSize: 9 },
      bulletText: { flex: 1, fontSize: 9, color: colors.text },
      text: { marginBottom: 6, fontSize: 9, color: colors.text, textAlign: 'justify' },
      space: { height: 6 }
    })
  }

  if (template === 'creative') {
    if (theme === 'blue') {
      colors = { primary: '#1e40af', secondary: '#e0f2fe', accent: '#3b82f6', text: '#1f2937', bg: '#ffffff', headerText: '#ffffff' }
    } else if (theme === 'crimson') {
      colors = { primary: '#991b1b', secondary: '#fee2e2', accent: '#dc2626', text: '#1f2937', bg: '#ffffff', headerText: '#ffffff' }
    } else { // teal
      colors = { primary: '#0d9488', secondary: '#ccfbf1', accent: '#14b8a6', text: '#1f2937', bg: '#ffffff', headerText: '#ffffff' }
    }
    return StyleSheet.create({
      page: { padding: 0, fontFamily: 'Helvetica', fontSize: 9.5, lineHeight: 1.4, color: colors.text, backgroundColor: colors.bg },
      headerBanner: { backgroundColor: colors.primary, paddingHorizontal: 40, paddingVertical: 25, color: '#ffffff', marginBottom: 20 },
      name: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: colors.headerText, marginBottom: 4 },
      contact: { fontSize: 9, color: colors.secondary },
      contentContainer: { paddingHorizontal: 40, paddingBottom: 40 },
      header: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 6, textTransform: 'uppercase', color: colors.primary, borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: 6 },
      bulletContainer: { flexDirection: 'row', marginBottom: 4, paddingLeft: 10 },
      bulletPoint: { width: 8, color: colors.accent, fontSize: 9.5 },
      bulletText: { flex: 1, fontSize: 9.5, color: colors.text },
      text: { marginBottom: 6, fontSize: 9.5, color: colors.text, textAlign: 'justify' },
      space: { height: 6 }
    })
  }

  // fallback ATS
  return StyleSheet.create({
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
}

const renderElement = (el: any, idx: number, styles: any) => {
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
}

// React Document Component
export const CVDocument = ({ 
  cvText, 
  template,
  colorTheme = 'classic'
}: { 
  cvText: string; 
  template: 'ats' | 'modern' | 'executive' | 'minimalist' | 'creative';
  colorTheme?: string;
}) => {
  const elements = parseCVText(cvText)
  const styles = getStylesForTemplate(template, colorTheme) as any

  if (template === 'creative') {
    const nameEl = elements.find(el => el.type === 'name')
    const contactEl = elements.find(el => el.type === 'contact')
    const bodyElements = elements.filter(el => el !== nameEl && el !== contactEl)

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerBanner}>
            {nameEl && <Text style={styles.name}>{nameEl.text}</Text>}
            {contactEl && <Text style={styles.contact}>{contactEl.text}</Text>}
          </View>
          <View style={styles.contentContainer}>
            {bodyElements.map((el, idx) => renderElement(el, idx, styles))}
          </View>
        </Page>
      </Document>
    )
  }

  if (template === 'modern') {
    const nameEl = elements.find(el => el.type === 'name')
    const contactEl = elements.find(el => el.type === 'contact')
    
    const sidebarSectionHeaders = [
      'skills', 'education', 'languages', 'certifications', 'skills & tools', 
      'interests', 'hobbies', 'contact', 'core skills', 'technical skills',
      'education & credentials', 'languages & tools'
    ]
    
    const leftColumnElements: any[] = []
    const rightColumnElements: any[] = []
    let currentColumn = rightColumnElements

    elements.forEach((el) => {
      if (el === nameEl || el === contactEl) return
      if (el.type === 'header') {
        const headerTextLower = el.text.toLowerCase()
        const isSidebarSection = sidebarSectionHeaders.some(h => headerTextLower.includes(h))
        currentColumn = isSidebarSection ? leftColumnElements : rightColumnElements
      }
      currentColumn.push(el)
    })

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerSection}>
            {nameEl && <Text style={styles.name}>{nameEl.text}</Text>}
            {contactEl && <Text style={styles.contact}>{contactEl.text}</Text>}
          </View>
          <View style={styles.columnsContainer}>
            <View style={styles.leftColumn}>
              {leftColumnElements.map((el, idx) => renderElement(el, idx, styles))}
            </View>
            <View style={styles.rightColumn}>
              {rightColumnElements.map((el, idx) => renderElement(el, idx, styles))}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {elements.map((el, idx) => renderElement(el, idx, styles))}
      </Page>
    </Document>
  )
}

/**
 * Generates a PDF buffer of the CV using a specified template.
 */
export async function generateCVBuffer(
  cvText: string,
  template: 'ats' | 'modern' | 'executive' | 'minimalist' | 'creative',
  colorTheme?: string
): Promise<Buffer> {
  const doc = React.createElement(CVDocument, { cvText, template, colorTheme })
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
