"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate: Date
  label?: string
  className?: string
}

export function CountdownTimer({ targetDate, label, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {label && <p className="text-muted-foreground mb-4 text-lg">{label}</p>}
        <div className="flex gap-4">
          {["Hari", "Jam", "Menit", "Detik"].map((unit) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="bg-card border border-border rounded-lg p-4 min-w-[70px] shadow-sm">
                <span className="text-3xl font-serif font-semibold text-foreground">--</span>
              </div>
              <span className="text-sm text-muted-foreground mt-2">{unit}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Hari" },
    { value: timeLeft.hours, label: "Jam" },
    { value: timeLeft.minutes, label: "Menit" },
    { value: timeLeft.seconds, label: "Detik" },
  ]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && <p className="text-muted-foreground mb-4 text-lg">{label}</p>}
      <div className="flex gap-3 md:gap-4">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-card border border-border rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[70px] shadow-sm">
              <span className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground mt-2">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
