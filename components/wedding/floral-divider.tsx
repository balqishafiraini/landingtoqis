interface FloralDividerProps {
  className?: string
}

export function FloralDivider({ className = "" }: FloralDividerProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <svg className="w-64 h-12 text-primary opacity-40" viewBox="0 0 200 40" fill="none">
        {/* Left branch */}
        <path d="M0 20 Q30 20, 50 15 Q60 12, 70 15 Q80 18, 85 20" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="50" cy="15" r="3" fill="currentColor" />
        <circle cx="70" cy="15" r="2" fill="currentColor" />

        {/* Center flower */}
        <circle cx="100" cy="20" r="8" fill="currentColor" opacity="0.6" />
        <circle cx="100" cy="20" r="4" fill="currentColor" />

        {/* Right branch */}
        <path
          d="M200 20 Q170 20, 150 15 Q140 12, 130 15 Q120 18, 115 20"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="150" cy="15" r="3" fill="currentColor" />
        <circle cx="130" cy="15" r="2" fill="currentColor" />

        {/* Leaves */}
        <ellipse cx="40" cy="18" rx="6" ry="3" fill="currentColor" opacity="0.4" transform="rotate(-20 40 18)" />
        <ellipse cx="160" cy="18" rx="6" ry="3" fill="currentColor" opacity="0.4" transform="rotate(20 160 18)" />
      </svg>
    </div>
  )
}
