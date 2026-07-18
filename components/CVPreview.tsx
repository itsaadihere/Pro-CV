'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Eye, Columns, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseCVText } from '@/lib/pdf-export'
import { getTemplate } from '@/components/cv-templates'
import { parseKimiCV } from '@/lib/cvParser'

interface CVPreviewProps {
  originalText: string
  revampedText: string
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  displayCVText: string
  formatting: boolean
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
  setSelectedColor,
  displayCVText,
  formatting
}: CVPreviewProps) {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after')
  const [layoutMode, setLayoutMode] = useState<'split' | 'single'>('split')
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual')

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

          {/* Template label */}
          {viewMode === 'visual' && activeTab === 'after' && (
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-inner">
              <span>Active Style: <strong className="font-mono text-blue-600 uppercase">{selectedTemplate.replace(/^m-|^min-/, '').replace(/-/g, ' ')}</strong></span>
            </div>
          )}

          {/* Color Switcher */}
          {viewMode === 'visual' && activeTab === 'after' && (
            (() => {
              const category = selectedTemplate === 'ats' 
                ? 'ats' 
                : (selectedTemplate === 'minimalist' || selectedTemplate.startsWith('min-')) 
                  ? (selectedTemplate.includes('ats') ? 'ats' : 'minimalist') 
                  : 'modern';
              const activeColors = colorOptions[category];
              if (!activeColors) return null;
              return (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                  <span className="text-slate-500">Color Palette:</span>
                  <div className="flex items-center gap-1.5">
                    {activeColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                          selectedColor === color.id
                            ? 'ring-2 ring-primary ring-offset-1 border-transparent scale-110'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex, width: '18px', height: '18px' }}
                        title={color.name}
                      >
                        {selectedColor === color.id && (
                          <span className="h-1 w-1 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()
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
            <div className="flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm animate-fade-in" title="Optimized using AI">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>AI Layout Active</span>
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
                  <span>Optimized by AI</span>
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
                    <span className="text-[11px] font-bold text-slate-500">AI is structuring layout...</span>
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
                  <span className="text-[11px] font-bold text-slate-500">AI is structuring layout...</span>
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
  template: string; 
  colorTheme: string 
}) {
  const cvData = parseKimiCV(cvText)
  const TemplateComponent = getTemplate(template)
  
  return (
    <div className="w-full overflow-y-auto max-h-[600px] flex justify-center bg-slate-100 p-4 border border-slate-200 rounded-b-2xl">
      <div style={{ transform: 'scale(0.6)', transformOrigin: 'top center', height: '674px', overflow: 'hidden' }}>
        <TemplateComponent data={cvData} scale={0.6} colorTheme={colorTheme} />
      </div>
    </div>
  )
}
