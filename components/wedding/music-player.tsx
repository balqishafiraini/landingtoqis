"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Volume2, VolumeX, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MusicPlayerProps {
  audioSrc?: string
}

// Definisi interface untuk memanggil fungsi dari luar
export interface MusicPlayerHandle {
  playMusic: () => void;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  ({ audioSrc = "/Lover.mp3" }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Ekspos fungsi play ke komponen induk (Parent)
    useImperativeHandle(ref, () => ({
      playMusic: () => {
        if (audioRef.current && !isPlaying) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          }).catch(err => console.log("Playback failed:", err));
        }
      }
    }));

    useEffect(() => {
      audioRef.current = new Audio(audioSrc)
      audioRef.current.loop = true
      audioRef.current.volume = 0.3

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
        audioRef.current.play().catch(() => {})
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
)

MusicPlayer.displayName = "MusicPlayer"