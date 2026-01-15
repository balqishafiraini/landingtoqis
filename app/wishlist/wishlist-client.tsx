"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Gift, Check, ExternalLink, ArrowLeft, Copy, Heart, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollReveal } from "@/components/wedding/scroll-reveal"
import { FloralDivider } from "@/components/wedding/floral-divider"

interface WishlistItem {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  product_url: string | null
  category: string
  is_claimed: boolean
  claimed_by: string | null
  priority: number
}

interface BankAccount {
  id: string
  bank_name: string
  account_number: string
  account_holder: string
}

interface WishlistClientProps {
  initialItems: WishlistItem[]
  bankAccounts: BankAccount[]
}

export function WishlistClient({ initialItems, bankAccounts }: WishlistClientProps) {
  const [items, setItems] = useState(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [claimerName, setClaimerName] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const categories = Array.from(new Set(initialItems.map((item) => item.category)))

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && !item.is_claimed) ||
      (statusFilter === "claimed" && item.is_claimed)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleClaim = async (itemId: string) => {
    if (!claimerName.trim()) return

    try {
      const response = await fetch("/api/wishlist/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, claimedBy: claimerName }),
      })

      if (response.ok) {
        setItems(
          items.map((item) => (item.id === itemId ? { ...item, is_claimed: true, claimed_by: claimerName } : item)),
        )
        setClaimingId(null)
        setClaimerName("")
      }
    } catch (error) {
      console.error("Error claiming item:", error)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return null
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Wedding Wishlist</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kehadiran dan doa Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberikan hadiah, berikut
              adalah beberapa hal yang kami impikan untuk memulai kehidupan baru kami bersama.
            </p>
          </motion.div>

          <FloralDivider className="mt-8" />
        </div>
      </section>

      {/* Bank Accounts */}
      <section className="py-12 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-2xl text-foreground text-center mb-6">Transfer Langsung</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bankAccounts.map((account, index) => (
                <Card key={account.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <p className="text-primary font-medium mb-2">{account.bank_name}</p>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="font-mono text-xl text-foreground">{account.account_number}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(account.account_number, index)}>
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">a.n. {account.account_holder}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 bg-card sticky top-0 z-40 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari hadiah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="claimed">Sudah Diklaim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="py-12 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <Gift className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada hadiah yang ditemukan</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 50}>
                  <Card
                    className={`bg-card border-border overflow-hidden h-full flex flex-col ${item.is_claimed ? "opacity-75" : ""}`}
                  >
                    <div className="aspect-square relative bg-muted">
                      {item.image_url ? (
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Gift className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      {item.is_claimed && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="secondary" className="text-lg py-2 px-4">
                            <Check className="w-4 h-4 mr-2" />
                            Sudah Diklaim
                          </Badge>
                        </div>
                      )}
                      {item.priority > 5 && !item.is_claimed && (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                          <Heart className="w-3 h-3 mr-1 fill-current" />
                          Prioritas
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <Badge variant="outline" className="w-fit mb-2 text-xs">
                        {item.category}
                      </Badge>
                      <h3 className="font-medium text-foreground mb-2">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      )}
                      {item.price && (
                        <p className="text-lg font-semibold text-primary mb-4">{formatPrice(item.price)}</p>
                      )}

                      <div className="mt-auto flex gap-2">
                        {item.product_url && (
                          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                            <a href={item.product_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Lihat
                            </a>
                          </Button>
                        )}
                        {!item.is_claimed && (
                          <Dialog
                            open={claimingId === item.id}
                            onOpenChange={(open) => {
                              setClaimingId(open ? item.id : null)
                              if (!open) setClaimerName("")
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" className="flex-1">
                                <Gift className="w-4 h-4 mr-1" />
                                Klaim
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Klaim Hadiah</DialogTitle>
                                <DialogDescription>
                                  Anda akan mengklaim &quot;{item.name}&quot; sebagai hadiah untuk Balqis & Erlan
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <label
                                    htmlFor="claimerName"
                                    className="text-sm font-medium text-foreground mb-2 block"
                                  >
                                    Nama Anda
                                  </label>
                                  <Input
                                    id="claimerName"
                                    placeholder="Masukkan nama Anda"
                                    value={claimerName}
                                    onChange={(e) => setClaimerName(e.target.value)}
                                  />
                                </div>
                                <Button
                                  onClick={() => handleClaim(item.id)}
                                  className="w-full"
                                  disabled={!claimerName.trim()}
                                >
                                  Konfirmasi Klaim
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card text-center">
        <p className="text-muted-foreground">
          Terima kasih atas perhatian dan kebaikan Anda. Setiap hadiah sangat berarti bagi kami.
        </p>
        <p className="font-serif text-xl text-foreground mt-4">
          Balqis <span className="text-primary">&</span> Erlan
        </p>
      </footer>
    </main>
  )
}
