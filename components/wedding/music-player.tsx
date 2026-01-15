"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MusicPlayerProps {
  audioSrc?: string
}

export function MusicPlayer({ audioSrc = "/Lover.mp3" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // 1. Inisialisasi Audio
    audioRef.current = new Audio(audioSrc)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    // 2. AUTO PLAY (Perbaikan di sini)
    // Gunakan 'const' (bukan cconst).
    // Karena komponen ini baru muncul setelah user klik tombol "Buka Undangan",
    // browser akan menganggap ini interaksi sah dan membolehkan autoplay.
    const playPromise = audioRef.current.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true) // Jika berhasil, ubah ikon jadi "Pause"
        })
        .catch((error) => {
          console.log("Autoplay prevented:", error)
          setIsPlaying(false) // Jika gagal, biarkan ikon "Play"
        })
    }

    // Cleanup saat keluar halaman
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioSrc])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        // Handle jika play gagal
      })
    }
    setIsPlaying(!isPlaying)
    setHasInteracted(true)
  }

  return (
    <Button
      onClick={toggleMusic}
      variant="outline"
      size="icon"
      className={`fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg transition-all duration-300 ${
        isPlaying ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
      } ${!hasInteracted ? "animate-pulse" : ""}`}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5" />
      ) : hasInteracted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Music className="h-5 w-5" />
      )}
    </Button>
  )
}