'use client'

import { useState } from 'react'
import { Copy, Check, Eye, Columns } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseCVText } from '@/lib/pdf-export'

interface CVPreviewProps {
  originalText: string
  revampedText: string
}

export default function CVPreview({ originalText, revampedText }: CVPreviewProps) {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after')
  const [layoutMode, setLayoutMode] = useState<'split' | 'single'>('split')
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual')
  const [selectedTemplate, setSelectedTemplate] = useState<'ats' | 'modern' | 'executive'>('ats')

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
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
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
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Visual Preview 🎨</span>
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'text'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Raw Text 📝</span>
            </button>
          </div>

          {/* Template Selectors (only visible when in visual mode and showing optimized CV) */}
          {viewMode === 'visual' && activeTab === 'after' && (
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 animate-fade-in shadow-inner">
              {(['ats', 'modern', 'executive'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTemplate(t)}
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

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span>Copy Active Tab</span>
        </button>
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
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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
              <VisualCV cvText={revampedText} template={selectedTemplate} />
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
            <VisualCV cvText={revampedText} template={selectedTemplate} />
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

function VisualCV({ cvText, template }: { cvText: string; template: 'ats' | 'modern' | 'executive' }) {
  const elements = parseCVText(cvText)
  
  const isModern = template === 'modern'
  const isExecutive = template === 'executive'
  const isAts = template === 'ats'

  return (
    <div 
      className={`w-full bg-white p-8 sm:p-12 overflow-y-auto max-h-[600px] text-left shadow-inner ${
        isExecutive ? 'font-serif text-[#111111] leading-relaxed' : 'font-sans text-slate-800 leading-normal'
      }`}
      style={{ minHeight: '500px' }}
    >
      {elements.map((el, idx) => {
        if (el.type === 'empty') {
          return <div key={idx} className={isModern ? 'h-3.5' : isExecutive ? 'h-3.5' : 'h-2.5'} />
        }
        if (el.type === 'name') {
          return (
            <h1 
              key={idx} 
              className={`font-bold tracking-tight text-slate-950 mb-1 ${
                isModern 
                  ? 'text-2xl sm:text-3xl text-blue-900 text-left font-sans' 
                  : isExecutive 
                  ? 'text-2xl sm:text-3xl text-center font-serif' 
                  : 'text-xl sm:text-2xl text-center font-sans'
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
              className={`text-slate-500 mb-4 ${
                isModern 
                  ? 'text-[11px] sm:text-xs text-left border-b border-slate-200 pb-2 font-sans' 
                  : isExecutive 
                  ? 'text-[11px] sm:text-xs text-center italic font-serif' 
                  : 'text-[11px] sm:text-xs text-center font-sans'
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
                isModern 
                  ? 'text-xs sm:text-sm text-blue-600 font-sans border-b border-slate-200 pb-1' 
                  : isExecutive 
                  ? 'text-xs sm:text-sm text-center border-b border-slate-800 pb-0.5 text-black font-serif' 
                  : 'text-xs sm:text-sm border-b border-slate-300 pb-0.5 text-black font-sans'
              }`}
            >
              {el.text}
            </h2>
          )
        }
        if (el.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-2 mb-1.5 pl-3 sm:pl-5">
              <span className={`text-[10px] select-none ${isModern ? 'text-blue-500 font-bold' : 'text-slate-600'}`}>•</span>
              <span className={`text-[11px] sm:text-[12px] flex-1 text-justify ${isModern ? 'text-slate-700 font-sans' : isExecutive ? 'text-slate-850 font-serif' : 'text-slate-700 font-sans'}`}>
                {el.text}
              </span>
            </div>
          )
        }
        return (
          <p 
            key={idx} 
            className={`text-[11px] sm:text-[12px] mb-2 text-justify ${
              isModern ? 'text-slate-700 font-sans' : isExecutive ? 'text-slate-850 font-serif' : 'text-slate-700 font-sans'
            }`}
          >
            {el.text}
          </p>
        )
      })}
    </div>
  )
}
