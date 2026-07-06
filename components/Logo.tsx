import React from 'react'

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
  const navyColor = light ? '#ffffff' : '#0f2b48'
  const goldColor = '#c5a059'
  const textColor = light ? '#e2e8f0' : '#1e293b'

  // Dynamic viewBox to crop empty vertical padding when tagline is hidden
  const viewBox = showTagline ? "0 0 400 400" : "0 50 400 300"

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="shrink-0"
      >
        {/* Outer Circular frame split at top and bottom */}
        {/* Top Arc */}
        <path
          d="M 80 180 A 130 130 0 0 1 320 180"
          stroke={navyColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom Arc */}
        <path
          d="M 320 220 A 130 130 0 0 1 80 220"
          stroke={navyColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Main "Sophi" brand text */}
        <g transform="translate(60, 140)">
          {/* Stylized letter S with gold arrow and leaves */}
          <path
            d="M 28 35 C 28 10, 50 5, 60 12 L 68 2 C 55 -8, 20 -5, 12 25 C 6 45, 18 65, 35 72 L 40 74 C 55 80, 68 85, 68 98 C 68 110, 52 118, 35 110 C 22 104, 25 88, 20 85"
            stroke={navyColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          {/* Gold leaf decorations growing from bottom-left of S */}
          <path
            d="M 5 72 C -10 65, -15 50, -8 40 C -3 45, -2 55, 3 65 Z"
            fill={goldColor}
          />
          <path
            d="M 12 85 C -5 85, -10 75, -6 65 C -2 70, 0 78, 6 82 Z"
            fill={goldColor}
          />
          <path
            d="M 18 95 C 5 105, 0 95, 2 85 C 6 88, 10 92, 14 93 Z"
            fill={goldColor}
          />
          {/* Gold arrow tip on top-right of S */}
          <path
            d="M 52 2 C 58 4, 66 12, 70 18 L 74 6 L 62 -2 Z"
            fill={goldColor}
          />
          <path
            d="M 68 12 L 74 6"
            stroke={goldColor}
            strokeWidth="3"
          />

          {/* Letter o */}
          <ellipse
            cx="110"
            cy="75"
            rx="18"
            ry="24"
            stroke={navyColor}
            strokeWidth="12"
            fill="none"
          />

          {/* Letter p */}
          <path
            d="M 148 45 L 148 125"
            stroke={navyColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 148 70 C 160 55, 182 55, 182 78 C 182 100, 160 102, 148 88"
            stroke={navyColor}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />

          {/* Letter h */}
          <path
            d="M 205 30 L 205 110"
            stroke={navyColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 205 75 C 215 60, 238 60, 238 80 L 238 110"
            stroke={navyColor}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />

          {/* Letter i with gold star instead of dot */}
          <path
            d="M 262 55 L 262 110"
            stroke={navyColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Gold Star instead of dot on 'i' */}
          <polygon
            points="262,24 265,31 272,31 267,35 269,42 262,38 255,42 257,35 252,31 259,31"
            fill={goldColor}
          />
        </g>

        {showTagline && (
          <>
            {/* Tagline divider lines */}
            <line
              x1="60"
              y1="250"
              x2="175"
              y2="250"
              stroke={navyColor}
              strokeWidth="2"
            />
            <line
              x1="225"
              y1="250"
              x2="340"
              y2="250"
              stroke={navyColor}
              strokeWidth="2"
            />

            {/* Tagline text: "Wisdom Behind Every Career." */}
            <text
              x="60"
              y="278"
              fill={textColor}
              fontSize="18"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="bold"
              textAnchor="start"
            >
              Wisdom Behind
            </text>
            <text
              x="320"
              y="278"
              fill={textColor}
              fontSize="18"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="bold"
              textAnchor="end"
            >
              Every Career.
            </text>
            
            {/* Tiny gold star at the end of tagline */}
            <polygon
              points="328,266 330,270 334,270 331,273 332,277 328,275 324,277 325,273 322,270 326,270"
              fill={goldColor}
            />
          </>
        )}
      </svg>
    </div>
  )
}
