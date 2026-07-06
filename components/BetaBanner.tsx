'use client'

import { useEffect, useState } from 'react'
import { isBetaActive, getBetaEndDate } from '@/lib/beta'

export default function BetaBanner() {
  const [timeLeft, setTimeLeft] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isBetaActive()) return
    setVisible(true)

    const update = () => {
      const now = new Date()
      const end = getBetaEndDate()
      const diff = end.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('Beta has ended')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s remaining`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div className="w-full bg-gradient-to-r from-primary via-primary-900 to-gold text-white text-center py-2.5 px-4 text-xs sm:text-sm font-medium shadow-md flex flex-col sm:flex-row items-center justify-center gap-1.5 z-[100] relative">
      <div className="flex items-center gap-1">
        <span>🚀</span>
        <strong>FREE BETA ACCESS</strong>
        <span>— No payment needed.</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="bg-white/15 px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wider shadow-inner text-gold">
          {timeLeft}
        </span>
        <span className="opacity-75 hidden md:inline">| Share with friends while it lasts!</span>
      </div>
    </div>
  )
}
