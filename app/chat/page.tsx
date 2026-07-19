'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientSupabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { Send, Mic, Square, Loader2, ArrowLeft, CheckCircle, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isAudio?: boolean
}

export default function ChatPage() {
  const router = useRouter()
  const supabase = getClientSupabase()
  const [loading, setLoading] = useState(true)
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I am Sophi, your AI CV Builder. Tell me about your professional background. You can type or send a voice note. To get started, what is your current job title and industry?' }
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expired. Please log in.')
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('cv_credits')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.cv_credits === 0) {
        router.push('/payment')
        return
      }
      setLoading(false)
    }
    checkAccess()
  }, [supabase, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendText = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    await processMessage(userMsg, null)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorder.current = recorder
      audioChunks.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        await processMessage('', audioBlob)
      }

      recorder.start()
      setIsRecording(true)
    } catch (err) {
      toast.error('Could not access microphone. Please allow permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
    }
  }

  const processMessage = async (text: string, audioBlob: Blob | null) => {
    const newMsg: Message = { 
      role: 'user', 
      content: audioBlob ? '🎙️ Voice note' : text,
      isAudio: !!audioBlob
    }
    setMessages(prev => [...prev, newMsg])
    setIsProcessing(true)

    try {
      const formData = new FormData()
      // Send history so the backend has context
      formData.append('history', JSON.stringify(messages))
      
      if (audioBlob) {
        formData.append('audio', audioBlob, 'voicenote.webm')
      } else {
        formData.append('text', text)
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to get response')

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])

      // If the AI decides it has enough info, it might return a flag and the final CV payload
      if (data.isComplete && data.cvData) {
        toast.success('CV generation started!')
        // Redirect to a generation loading screen or directly call generate endpoint
        createJobAndRedirect(data.cvData)
      }

    } catch (err: any) {
      toast.error(err.message)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Could you try again?' }])
    } finally {
      setIsProcessing(false)
    }
  }

  const createJobAndRedirect = async (cvData: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Extract details from cvData if needed, or ask the user for them,
      // for now we set defaults
      const { data: job, error } = await supabase.from('cv_jobs').insert({
        user_id: session.user.id,
        target_industry: 'General',
        output_language: 'EN',
        original_file_path: 'from_scratch_chat',
        status: 'pending'
      }).select('id').single()

      if (error) throw error

      // Call generate API in background and redirect to dashboard
      fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: cvData,
          industry: 'General',
          language: 'EN',
          jobId: job.id
        })
      })

      router.push('/dashboard')
      toast.success('Your CV is being built! It will appear here shortly.')

    } catch (error: any) {
      toast.error('Failed to create job: ' + error.message)
    }
  }

  if (loading) return null

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-64px)]">
        <div className="flex items-center gap-4 py-4 border-b border-slate-200">
          <Link href="/choice" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Interactive CV Builder
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                {m.content.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-3.5 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-slate-500">Sophi is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 pb-2 border-t border-slate-200">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-full p-1.5 pl-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <input
              type="text"
              placeholder="Type your response..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendText()}
              disabled={isProcessing || isRecording}
            />
            
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 animate-pulse transition-colors"
                title="Stop Recording"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={isProcessing || input.trim().length > 0}
                className={`p-2.5 rounded-full transition-colors ${
                  input.trim() ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title="Voice Note"
              >
                <Mic className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={handleSendText}
              disabled={!input.trim() || isProcessing || isRecording}
              className={`p-2.5 rounded-full transition-colors ${
                input.trim() ? 'bg-primary text-white hover:bg-primary-800' : 'bg-slate-100 text-slate-400'
              }`}
              title="Send Text"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
