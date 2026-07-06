import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  width?: number | string
  height?: number | string
  showTagline?: boolean
  light?: boolean
}

export default function Logo({
  className = '',
  width = 180,
  height = 180,
  showTagline = true,
  light = false
}: LogoProps) {
  // Convert width and height to numbers for next/image
  const w = typeof width === 'number' ? width : parseInt(width as string) || 180
  const h = typeof height === 'number' ? height : parseInt(height as string) || 180

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Image
        src="/images/logo.svg"
        alt="Sophi Logo"
        width={w}
        height={h}
        priority
        className="shrink-0 object-contain"
      />
    </div>
  )
}

