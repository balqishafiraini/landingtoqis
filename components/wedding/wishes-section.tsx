"use client"

import type React from "react"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Loader2, Send, MessageCircle } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

interface Wish {
  id: string
  name: string
  message: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function WishesSection() {
  const { data, error } = useSWR<Wish[] | { error: string }>("/api/wishes", fetcher, {
    refreshInterval: 30000,
  })

  const wishes = Array.isArray(data) ? data : []
  const hasError = error || (data && !Array.isArray(data))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: "", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.message.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", message: "" })
        mutate("/api/wishes")
      }
    } catch (error) {
      console.error("Wishes submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <section className="py-16 md:py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Ucapan & Doa</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Berikan ucapan dan doa terbaik untuk kedua mempelai
            </p>
          </div>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal delay={200}>
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Tulis ucapan dan doa Anda..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Ucapan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Wishes List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {hasError && <p className="text-center text-muted-foreground">Gagal memuat ucapan</p>}
          {!data && !error && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          {wishes.map((wish, index) => (
            <ScrollReveal key={wish.id} delay={index * 100}>
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{wish.name}</h4>
                        <span className="text-xs text-muted-foreground shrink-0">{formatDate(wish.created_at)}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{wish.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
