'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Eye, Columns, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseCVText } from '@/lib/pdf-export'

interface CVPreviewProps {
  originalText: string
  revampedText: string
  selectedTemplate: 'ats' | 'modern' | 'minimalist'
  setSelectedTemplate: (template: 'ats' | 'modern' | 'minimalist') => void
  selectedColor: string
  setSelectedColor: (color: string) => void
}

const colorOptions: Record<string, { id: string; name: string; hex: string }[]> = {
  ats: [
    { id: 'classic', name: 'Classic Black', hex: '#000000' },
    { id: 'navy', name: 'Navy Blue', hex: '#0f172a' },
    { id: 'charcoal', name: 'Charcoal', hex: '#27272a' },
  ],
  modern: [
    { id: 'blue', name: 'Royal Blue', hex: '#2563eb' },
    { id: 'gold', name: 'Gold', hex: '#c5a059' },
    { id: 'purple', name: 'Deep Violet', hex: '#7c3aed' },
  ],
  minimalist: [
    { id: 'charcoal', name: 'Sleek Zinc', hex: '#52525b' },
    { id: 'warm', name: 'Warm Amber', hex: '#d97706' },
    { id: 'gold', name: 'Gold Accent', hex: '#c5a059' },
  ],
}

export default function CVPreview({ 
  originalText, 
  revampedText,
  selectedTemplate,
  setSelectedTemplate,
  selectedColor,
  setSelectedColor
}: CVPreviewProps) {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after')
  const [layoutMode, setLayoutMode] = useState<'split' | 'single'>('split')
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual')

  // Gemini Layout Formatting states
  const [displayCVText, setDisplayCVText] = useState(revampedText)
  const [formatting, setFormatting] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchGeminiFormat() {
      if (!revampedText) return
      
      setFormatting(true)
      try {
        const res = await fetch('/api/format-cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cvText: revampedText,
            template: selectedTemplate,
          }),
        })

        if (res.ok && active) {
          const data = await res.json()
          setDisplayCVText(data.formattedText)
        }
      } catch (err) {
        console.error('Error fetching Gemini format:', err)
      } finally {
        if (active) setFormatting(false)
      }
    }

    fetchGeminiFormat()

    return () => {
      active = false
    }
  }, [selectedTemplate, revampedText])

  const handleTemplateChange = (t: 'ats' | 'modern' | 'minimalist') => {
    setSelectedTemplate(t)
    const defaultColor = colorOptions[t]?.[0]?.id || 'classic'
    setSelectedColor(defaultColor)
  }

  const handleCopy = async () => {
    try {
      const textToCopy = activeTab === 'after' ? revampedText : originalText
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success('CV text copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy text.')
    }
  }

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('CV text copied!')
    } catch (err) {
      toast.error('Failed to copy text.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Tab: Before vs After */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('after')}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'after'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-650 hover:bg-slate-50'
              }`}
            >
              Optimized CV (After)
            </button>
            <button
              onClick={() => setActiveTab('before')}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'before'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Original CV (Before)
            </button>
          </div>

          {/* View Mode Toggle: Visual vs Raw Text */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => setViewMode('visual')}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'visual'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-650 hover:bg-slate-50'
              }`}
            >
              <span>Visual Preview 🎨</span>
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'text'
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-slate-655 hover:bg-slate-50'
              }`}
            >
              <span>Raw Text 📝</span>
            </button>
          </div>

          {/* Template Selectors (only visible when in visual mode and showing optimized CV) */}
          {viewMode === 'visual' && activeTab === 'after' && (
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 animate-fade-in shadow-inner">
              {(['ats', 'modern', 'minimalist'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTemplateChange(t)}
                  className={`rounded-md px-3 py-1.5 text-xs font-extrabold transition-all uppercase ${
                    selectedTemplate === t
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Accent Color Circle Selector */}
          {viewMode === 'visual' && activeTab === 'after' && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 animate-fade-in shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Contrast</span>
              <div className="flex items-center gap-1.5">
                {colorOptions[selectedTemplate]?.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedColor(opt.id)}
                    className={`h-5 w-5 rounded-full border transition-all flex items-center justify-center ${
                      selectedColor === opt.id 
                        ? 'ring-2 ring-blue-500 border-white scale-110 shadow-sm' 
                        : 'border-slate-350 hover:scale-105'
                    }`}
                    style={{ backgroundColor: opt.hex }}
                    title={opt.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Layout split trigger for desktop */}
          <div className="hidden rounded-lg border border-slate-200 bg-white p-1 md:flex">
            <button
              onClick={() => setLayoutMode('split')}
              className={`rounded-md p-1.5 transition-colors ${
                layoutMode === 'split' ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
              title="Split View"
            >
              <Columns className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayoutMode('single')}
              className={`rounded-md p-1.5 transition-colors ${
                layoutMode === 'single' ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
              title="Single View"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {viewMode === 'visual' && activeTab === 'after' && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm animate-fade-in" title="Optimized using Google Gemini AI">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>Gemini AI Active</span>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy Active Tab</span>
          </button>
        </div>
      </div>

      {/* CV Render Board */}
      {layoutMode === 'split' ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Original CV */}
          <div className="flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Original (Parsed Text)</span>
              <button
                onClick={() => handleCopyText(originalText)}
                className="text-slate-400 hover:text-slate-600"
                title="Copy Original"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <pre className="flex-1 overflow-auto max-h-[600px] p-6 text-left font-mono text-[11px] leading-relaxed text-slate-500 bg-slate-50/20 whitespace-pre-wrap select-all font-jetbrains">
              {originalText || 'Original CV text could not be loaded.'}
            </pre>
          </div>

          {/* Revamped CV */}
          <div className="flex flex-col rounded-2xl border border-blue-200 overflow-hidden bg-white shadow-md ring-1 ring-blue-500/10">
            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/50 px-4 py-3">
              <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1">
                {viewMode === 'visual' ? (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span>Visual Preview: {selectedTemplate} layout</span>
                  </>
                ) : (
                  <span>Optimized by Kimi AI</span>
                )}
              </span>
              <button
                onClick={() => handleCopyText(revampedText)}
                className="text-blue-500 hover:text-blue-700"
                title="Copy Revamped"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            {viewMode === 'visual' ? (
              <div className="relative flex-1 flex flex-col min-h-[500px]">
                {formatting && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2 rounded-2xl animate-fade-in">
                    <Loader2 className="h-7 w-7 text-primary animate-spin" />
                    <span className="text-[11px] font-bold text-slate-500">Gemini AI is structuring layout...</span>
                  </div>
                )}
                <VisualCV cvText={displayCVText} template={selectedTemplate} colorTheme={selectedColor} />
              </div>
            ) : (
              <pre className="flex-1 overflow-auto max-h-[600px] p-6 text-left font-mono text-[11.5px] leading-relaxed text-slate-800 bg-white whitespace-pre-wrap select-all font-jetbrains">
                {revampedText || 'Optimized CV text is loading or empty.'}
              </pre>
            )}
          </div>
        </div>
      ) : (
        /* Single/Mobile View */
        <div className="flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-xs font-bold text-slate-600 uppercase">
              {activeTab === 'after'
                ? (viewMode === 'visual' ? `Visual Preview: ${selectedTemplate} layout` : 'Optimized CV (After)')
                : 'Original CV (Before)'}
            </span>
            {viewMode === 'text' && <span className="text-xs text-slate-400">JetBrains Mono</span>}
          </div>
          {activeTab === 'after' && viewMode === 'visual' ? (
            <div className="relative flex-1 flex flex-col min-h-[500px]">
              {formatting && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2 rounded-2xl animate-fade-in">
                  <Loader2 className="h-7 w-7 text-emerald-600 animate-spin" />
                  <span className="text-[11px] font-bold text-slate-500">Gemini AI is structuring layout...</span>
                </div>
              )}
              <VisualCV cvText={displayCVText} template={selectedTemplate} colorTheme={selectedColor} />
            </div>
          ) : (
            <pre className={`overflow-auto max-h-[650px] p-6 text-left font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap font-jetbrains ${
              activeTab === 'after' ? 'text-slate-800 bg-white' : 'text-slate-500 bg-slate-50/25'
            }`}>
              {activeTab === 'after' ? revampedText : originalText}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

function VisualCV({ 
  cvText, 
  template, 
  colorTheme 
}: { 
  cvText: string; 
  template: 'ats' | 'modern' | 'executive' | 'minimalist' | 'creative'; 
  colorTheme: string 
}) {
  const elements = parseCVText(cvText)
  
  const isAts = template === 'ats'
  const isModern = template === 'modern'
  const isExecutive = template === 'executive'
  const isMinimalist = template === 'minimalist'
  const isCreative = template === 'creative'

  // Theme customization parameters
  let primaryColor = 'text-slate-900'
  let secondaryColor = 'text-slate-500'
  let accentColor = 'bg-blue-600'
  let accentTextColor = 'text-blue-600'
  let accentBorderColor = 'border-slate-200'
  let bgStyles = 'bg-white'
  let fontStyles = 'font-sans'

  if (isAts) {
    fontStyles = 'font-sans text-[12px]'
    if (colorTheme === 'navy') {
      primaryColor = 'text-slate-900'
      secondaryColor = 'text-slate-500'
      accentBorderColor = 'border-slate-300'
    } else if (colorTheme === 'charcoal') {
      primaryColor = 'text-zinc-800'
      secondaryColor = 'text-zinc-550'
      accentBorderColor = 'border-zinc-300'
    } else {
      primaryColor = 'text-black'
      secondaryColor = 'text-slate-500'
      accentBorderColor = 'border-slate-200'
    }
  } else if (isModern) {
    fontStyles = 'font-sans text-[12px]'
    if (colorTheme === 'gold') {
      primaryColor = 'text-slate-900'
      secondaryColor = 'text-gold-700'
      accentColor = 'bg-gold'
      accentTextColor = 'text-gold'
      accentBorderColor = 'border-gold-200'
    } else if (colorTheme === 'purple') {
      primaryColor = 'text-violet-950'
      secondaryColor = 'text-violet-700'
      accentColor = 'bg-violet-600'
      accentTextColor = 'text-violet-600'
      accentBorderColor = 'border-violet-250'
    } else { // blue
      primaryColor = 'text-blue-950'
      secondaryColor = 'text-blue-700'
      accentColor = 'bg-blue-600'
      accentTextColor = 'text-blue-600'
      accentBorderColor = 'border-blue-250'
    }
  } else if (isExecutive) {
    fontStyles = 'font-serif text-[13px] leading-relaxed'
    if (colorTheme === 'burgundy') {
      primaryColor = 'text-rose-950'
      secondaryColor = 'text-slate-600'
      accentBorderColor = 'border-rose-900/40'
      accentTextColor = 'text-rose-900'
    } else if (colorTheme === 'navy') {
      primaryColor = 'text-slate-950'
      secondaryColor = 'text-slate-600'
      accentBorderColor = 'border-blue-950/40'
      accentTextColor = 'text-blue-950'
    } else {
      primaryColor = 'text-black'
      secondaryColor = 'text-slate-700'
      accentBorderColor = 'border-black/30'
      accentTextColor = 'text-black'
    }
  } else if (isMinimalist) {
    fontStyles = 'font-sans text-[11.5px] tracking-wide'
    if (colorTheme === 'warm') {
      primaryColor = 'text-amber-950'
      secondaryColor = 'text-amber-800'
      accentColor = 'bg-amber-500'
      accentTextColor = 'text-amber-700'
      accentBorderColor = 'border-amber-200'
      bgStyles = 'bg-amber-50/20'
    } else if (colorTheme === 'gold') {
      primaryColor = 'text-slate-900'
      secondaryColor = 'text-gold-700'
      accentColor = 'bg-gold'
      accentTextColor = 'text-gold'
      accentBorderColor = 'border-gold-200'
      bgStyles = 'bg-gold-50/10'
    } else { // charcoal
      primaryColor = 'text-zinc-800'
      secondaryColor = 'text-zinc-500'
      accentColor = 'bg-zinc-400'
      accentTextColor = 'text-zinc-650'
      accentBorderColor = 'border-zinc-200'
      bgStyles = 'bg-zinc-50/30'
    }
  } else if (isCreative) {
    fontStyles = 'font-sans text-[12px]'
    if (colorTheme === 'blue') {
      primaryColor = 'text-blue-900'
      secondaryColor = 'text-blue-200'
      accentColor = 'bg-blue-800'
      accentTextColor = 'text-blue-700'
      accentBorderColor = 'border-blue-200'
    } else if (colorTheme === 'crimson') {
      primaryColor = 'text-red-900'
      secondaryColor = 'text-red-200'
      accentColor = 'bg-red-800'
      accentTextColor = 'text-red-705'
      accentBorderColor = 'border-red-200'
    } else { // teal
      primaryColor = 'text-teal-900'
      secondaryColor = 'text-teal-200'
      accentColor = 'bg-teal-700'
      accentTextColor = 'text-teal-600'
      accentBorderColor = 'border-teal-200'
    }
  }

function renderHTMLPreviewElement(el: any, idx: number, theme: any) {
  if (el.type === 'empty') {
    return <div key={idx} className="h-2" />
  }
  if (el.type === 'name') {
    return <h1 key={idx} className={`text-xl sm:text-2xl font-bold mb-1 ${theme.primaryColor}`}>{el.text}</h1>
  }
  if (el.type === 'contact') {
    return <p key={idx} className={`text-[11px] sm:text-xs mb-3 ${theme.secondaryColor}`}>{el.text}</p>
  }
  if (el.type === 'header') {
    return (
      <h2 key={idx} className={`font-bold uppercase tracking-wider text-[11px] sm:text-xs pb-1 mt-3 mb-1.5 ${
        theme.isModern 
          ? `${theme.accentTextColor} border-b ${theme.accentBorderColor}` 
          : theme.isMinimalist 
          ? `${theme.primaryColor} border-b ${theme.accentBorderColor} tracking-widest`
          : `text-black border-b ${theme.accentBorderColor}`
      }`}>
        {el.text}
      </h2>
    )
  }
  if (el.type === 'bullet') {
    return (
      <div key={idx} className="flex items-start gap-1.5 mb-1 pl-1">
        <span className={`text-[9px] select-none ${theme.accentTextColor || 'text-slate-500'}`}>•</span>
        <span className={`text-[11px] sm:text-[12px] flex-1 text-justify ${theme.fontStyles || 'font-sans'} text-slate-700`}>
          {el.text}
        </span>
      </div>
    )
  }
  return (
    <p key={idx} className={`text-[11px] sm:text-[12px] text-justify mb-1.5 ${theme.fontStyles || 'font-sans'} text-slate-700`}>
      {el.text}
    </p>
  )
}

  if (isCreative) {
    const nameEl = elements.find(el => el.type === 'name')
    const contactEl = elements.find(el => el.type === 'contact')
    const bodyElements = elements.filter(el => el !== nameEl && el !== contactEl)

    return (
      <div className={`w-full bg-white overflow-y-auto max-h-[600px] text-left shadow-inner ${fontStyles}`} style={{ minHeight: '500px' }}>
        <div className={`${accentColor} p-6 sm:p-8 text-white`}>
          {nameEl && <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{nameEl.text}</h1>}
          {contactEl && <p className="text-[11px] sm:text-xs mt-1.5 opacity-90">{contactEl.text}</p>}
        </div>
        <div className="p-6 sm:p-8 space-y-3">
          {bodyElements.map((el, idx) => renderHTMLPreviewElement(el, idx, { primaryColor, secondaryColor, accentTextColor, accentBorderColor, isModern: false, fontStyles }))}
        </div>
      </div>
    )
  }

  if (isModern) {
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
      <div className={`w-full bg-white p-6 sm:p-8 overflow-y-auto max-h-[600px] text-left shadow-inner ${fontStyles}`} style={{ minHeight: '500px' }}>
        {/* Top Header Section */}
        <div className={`border-b ${accentBorderColor} pb-2.5 mb-4`}>
          {nameEl && <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${primaryColor}`}>{nameEl.text}</h1>}
          {contactEl && <p className={`text-[11px] sm:text-xs mt-1.5 ${secondaryColor}`}>{contactEl.text}</p>}
        </div>

        {/* 2-Column Split Body */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Left Column (32%) */}
          <div className={`w-full md:w-[32%] md:border-r ${accentBorderColor} md:pr-4 space-y-3`}>
            {leftColumnElements.map((el, idx) => renderHTMLPreviewElement(el, idx, { primaryColor, secondaryColor, accentTextColor, accentBorderColor, isModern: true, fontStyles }))}
          </div>
          {/* Right Column (68%) */}
          <div className="w-full md:w-[68%] space-y-3">
            {rightColumnElements.map((el, idx) => renderHTMLPreviewElement(el, idx, { primaryColor, secondaryColor, accentTextColor, accentBorderColor, isModern: true, fontStyles }))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`w-full ${bgStyles} p-8 sm:p-12 overflow-y-auto max-h-[600px] text-left shadow-inner ${fontStyles}`}
      style={{ minHeight: '500px' }}
    >
      {elements.map((el, idx) => {
        if (el.type === 'empty') {
          return <div key={idx} className={isModern || isExecutive ? 'h-3.5' : 'h-2.5'} />
        }
        if (el.type === 'name') {
          return (
            <h1 
              key={idx} 
              className={`font-bold tracking-tight mb-1 ${
                isExecutive 
                  ? 'text-2xl sm:text-3xl text-center text-black' 
                  : isMinimalist
                  ? `text-xl sm:text-2xl text-center uppercase tracking-widest ${primaryColor}`
                  : 'text-xl sm:text-2xl text-center text-black'
              }`}
            >
              {el.text}
            </h1>
          )
        }
        if (el.type === 'contact') {
          return (
            <p 
              key={idx} 
              className={`mb-4 ${
                isExecutive 
                  ? 'text-[11px] sm:text-xs text-center italic text-slate-650' 
                  : isMinimalist
                  ? `text-[10px] sm:text-[11px] text-center tracking-wider pb-3 border-b ${accentBorderColor} ${secondaryColor}`
                  : `text-[11px] sm:text-xs text-center ${secondaryColor}`
              }`}
            >
              {el.text}
            </p>
          )
        }
        if (el.type === 'header') {
          return (
            <h2 
              key={idx} 
              className={`font-bold uppercase tracking-wider pb-1 mt-4 mb-2 ${
                isExecutive 
                  ? `text-xs sm:text-sm text-center border-b ${accentBorderColor} ${primaryColor}` 
                  : isMinimalist
                  ? `text-xs ${primaryColor} border-b ${accentBorderColor} tracking-widest`
                  : `text-xs sm:text-sm border-b ${accentBorderColor} text-black`
              }`}
            >
              {el.text}
            </h2>
          )
        }
        if (el.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-2 mb-1.5 pl-3 sm:pl-5">
              <span className="text-[10px] select-none text-slate-500">•</span>
              <span className={`text-[11px] sm:text-[12.5px] flex-1 text-justify ${isMinimalist ? 'text-slate-700' : isExecutive ? 'text-slate-850' : 'text-slate-750'}`}>
                {el.text}
              </span>
            </div>
          )
        }
        return (
          <p 
            key={idx} 
            className={`text-[11px] sm:text-[12.5px] mb-2 text-justify ${
              isMinimalist ? 'text-slate-700' : isExecutive ? 'text-slate-850' : 'text-slate-750'
            }`}
          >
            {el.text}
          </p>
        )
      })}
    </div>
  )
}
