'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ATSScoreProps {
  scoreData: {
    overall: number
    keywordMatch: number
    formatCompliance: number
    achievementDensity: number
    readability: number
    skillsAlignment: number
    issues: string[]
  }
}

export default function ATSScoreCard({ scoreData }: ATSScoreProps) {
  const {
    overall = 70,
    keywordMatch = 70,
    formatCompliance = 70,
    achievementDensity = 70,
    readability = 70,
    skillsAlignment = 70,
    issues = [],
  } = scoreData

  // Determine colors based on score value
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-primary stroke-primary'
    if (val >= 70) return 'text-gold stroke-gold'
    return 'text-red-500 stroke-red-500'
  }

  const getScoreBgColor = (val: number) => {
    if (val >= 85) return 'bg-primary-50 border-primary-100'
    if (val >= 70) return 'bg-gold-50 border-gold-100'
    return 'bg-red-50 border-red-100'
  }

  // Circular progress calculations
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overall / 100) * circumference

  const metrics = [
    { label: 'Keyword Match', value: keywordMatch },
    { label: 'Format Compliance', value: formatCompliance },
    { label: 'Achievement Density', value: achievementDensity },
    { label: 'Readability', value: readability },
    { label: 'Skills Alignment', value: skillsAlignment },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Circle Score Display */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-5">
        <h3 className="text-base font-bold text-slate-800 mb-6">ATS Overall Score</h3>
        <div className="relative flex items-center justify-center h-40 w-40">
          <svg className="absolute transform -rotate-90 h-full w-full">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100 fill-transparent"
              strokeWidth="10"
            />
            {/* Foreground Score Circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              className={`fill-transparent ${getScoreColor(overall).split(' ')[1]}`}
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(overall).split(' ')[0]}`}>
              {overall}
            </span>
            <span className="block text-xs font-semibold text-slate-400 uppercase mt-0.5">Scale / 100</span>
          </div>
        </div>

        <div className={`mt-6 w-full rounded-xl border px-4 py-3 text-center text-xs font-semibold ${getScoreBgColor(overall)}`}>
          {overall >= 85 ? (
            <span className="text-primary-950">Excellent! Ready for applications.</span>
          ) : overall >= 70 ? (
            <span className="text-gold-900">Good, but could be optimized further.</span>
          ) : (
            <span className="text-red-800">Needs attention before submitting.</span>
          )}
        </div>
      </div>

      {/* Metrics Breakdown & Issues */}
      <div className="flex flex-col gap-6 md:col-span-7">
        {/* Progress Metrics */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-5">Dimension Analysis</h3>
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{metric.label}</span>
                  <span>{metric.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      metric.value >= 85
                        ? 'bg-primary'
                        : metric.value >= 70
                        ? 'bg-gold'
                        : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Issues Found */}
        <div className="rounded-2xl border border-red-100 bg-red-50/30 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Critical Optimization Checklist</span>
          </h3>
          {issues.length > 0 ? (
            <ul className="space-y-2.5">
              {issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-sm text-primary-950 font-bold">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>No critical format or layout issues found. Excellent compliance!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
