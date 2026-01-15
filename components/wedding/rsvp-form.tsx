"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, Users } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

interface RSVPFormProps {
  eventType: "lampung" | "jakarta"
  guestId?: string
}

export function RSVPForm({ eventType, guestId }: RSVPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    attendance: "hadir",
    guestCount: "1",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eventType,
          guestId,
          guestCount: Number.parseInt(formData.guestCount),
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("RSVP submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <ScrollReveal>
        <Card className="bg-card border-border max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">Terima Kasih!</h3>
            <p className="text-muted-foreground">
              Konfirmasi kehadiran Anda telah kami terima. Kami sangat menantikan kehadiran Anda.
            </p>
          </CardContent>
        </Card>
      </ScrollReveal>
    )
  }

  return (
    <ScrollReveal>
      <Card className="bg-card border-border max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <CardTitle className="font-serif text-2xl text-foreground">Konfirmasi Kehadiran</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">Mohon konfirmasi kehadiran Anda sebelum tanggal acara</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama Anda"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Konfirmasi Kehadiran</Label>
              <RadioGroup
                value={formData.attendance}
                onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="hadir"
                  className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.attendance === "hadir"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="hadir" id="hadir" className="sr-only" />
                  <span className="text-foreground">Hadir</span>
                </Label>
                <Label
                  htmlFor="tidak_hadir"
                  className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.attendance === "tidak_hadir"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="tidak_hadir" id="tidak_hadir" className="sr-only" />
                  <span className="text-foreground">Tidak Hadir</span>
                </Label>
              </RadioGroup>
            </div>

            {formData.attendance === "hadir" && (
              <div className="space-y-2">
                <Label htmlFor="guestCount" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Jumlah Tamu
                </Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Konfirmasi"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}
