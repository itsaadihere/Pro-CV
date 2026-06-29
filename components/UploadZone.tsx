'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

interface UploadZoneProps {
  onFileSelected: (file: File) => void
  selectedFile: File | null
}

export default function UploadZone({ onFileSelected, selectedFile }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)
      
      if (rejectedFiles && rejectedFiles.length > 0) {
        const rej = rejectedFiles[0]
        if (rej.errors[0]?.code === 'file-too-large') {
          setError('File is too large. Maximum size is 5MB.')
        } else if (rej.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Only PDF and DOCX files are supported.')
        } else {
          setError(rej.errors[0]?.message || 'Error uploading file.')
        }
        return
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0])
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50/50'
            : selectedFile
            ? 'border-emerald-500 bg-emerald-50/30'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
        }`}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">CV Uploaded Successfully!</p>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-150 bg-emerald-50/60 px-3 py-1.5 text-xs text-emerald-800 font-medium">
              <FileText className="h-3.5 w-3.5" />
              <span>{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Click or drag another file to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 transition-transform group-hover:scale-105">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {isDragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Supports PDF and DOCX (Max size 5MB)
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
