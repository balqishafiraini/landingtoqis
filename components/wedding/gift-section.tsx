"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Copy, Check, CreditCard, ExternalLink, QrCode } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import Link from "next/link"
import Image from "next/image"

interface BankAccount {
  bank_name: string
  account_number: string
  account_holder: string
}

interface GiftSectionProps {
  bankAccounts: BankAccount[]
  qrisImageUrl?: string
}

export function GiftSection({ bankAccounts, qrisImageUrl }: GiftSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showQris, setShowQris] = useState(false)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section className="py-16 md:py-24 px-6 bg-card">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Wedding Gift</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami
              menyediakan beberapa opsi berikut:
            </p>
          </div>
        </ScrollReveal>

        {qrisImageUrl && (
          <ScrollReveal delay={100}>
            <Card className="bg-background border-border mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <QrCode className="w-5 h-5 text-primary" />
                  QRIS - Scan untuk Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div
                  className="relative w-64 h-64 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowQris(true)}
                >
                  <Image
                    src={qrisImageUrl || "/placeholder.svg"}
                    alt="QRIS Code untuk transfer"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3">Tap untuk memperbesar</p>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {bankAccounts.map((account, index) => (
            <ScrollReveal key={index} delay={(index + 1) * 150}>
              <Card className="bg-background border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                    {account.bank_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nomor Rekening</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-lg text-foreground">{account.account_number}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(account.account_number, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Atas Nama</p>
                      <p className="font-medium text-foreground">{account.account_holder}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/wishlist">
                <ExternalLink className="w-4 h-4 mr-2" />
                Lihat Wishlist Hadiah
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>

      {showQris && qrisImageUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQris(false)}
        >
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src={qrisImageUrl || "/placeholder.svg"}
              alt="QRIS Code untuk transfer"
              fill
              className="object-contain"
            />
          </div>
          <button className="absolute top-4 right-4 text-white text-xl" onClick={() => setShowQris(false)}>
            ✕
          </button>
        </div>
      )}
    </section>
  )
}
