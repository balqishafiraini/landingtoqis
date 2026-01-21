"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { motion } from "framer-motion";
import {
  Gift,
  Check,
  ExternalLink,
  ArrowLeft,
  Copy,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/wedding/scroll-reveal";
import { FloralDivider } from "@/components/wedding/floral-divider";
// Jika kamu punya component toast (misal Sonner), bisa di-uncomment:
// import { toast } from "sonner"

interface WishlistItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  shop_link: string | null;
  is_claimed: boolean;
  claimed_by: string | null;
}

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
}

interface WishlistClientProps {
  initialItems: WishlistItem[];
  bankAccounts: BankAccount[];
}

export function WishlistClient({
  initialItems,
  bankAccounts,
}: WishlistClientProps) {
  const router = useRouter(); // Inisialisasi router
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimerName, setClaimerName] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State loading

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && !item.is_claimed) ||
      (statusFilter === "claimed" && item.is_claimed);
    return matchesSearch && matchesStatus;
  });

  // --- LOGIKA KLAIM KE DATABASE ---
  const handleClaim = async (itemId: string) => {
    if (!claimerName.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/wishlist/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          claimedBy: claimerName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal melakukan klaim");
      }

      // Sukses
      setClaimingId(null);
      setClaimerName("");
      alert(
        "Terima kasih atas kebaikan hatinya! Mohon hubungi WhatsApp 081541140434 untuk info lebih lanjut.",
      ); // Ganti dengan toast.success jika ada

      // Refresh halaman agar data terbaru muncul
      router.refresh();
    } catch (error: any) {
      alert(error.message); // Ganti dengan toast.error jika ada
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="min-h-screen bg-background pb-20">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              Wedding Wishlist
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kehadiran Anda adalah hadiah terindah. Namun jika ingin memberi
              tanda kasih, berikut adalah yang kami butuhkan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-6 bg-card sticky top-0 z-40 border-b border-border shadow-sm">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="available">Belum Diklaim</SelectItem>
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
              <p className="text-muted-foreground">
                Tidak ada hadiah yang ditemukan
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 50}>
                  <Card
                    className={`bg-card border-border overflow-hidden h-full flex flex-col transition-all ${
                      item.is_claimed
                        ? "opacity-75 grayscale-[0.5]"
                        : "hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-square relative bg-muted">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                          <Gift className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}

                      {item.is_claimed && (
                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center p-4 text-center">
                          <Badge
                            variant="secondary"
                            className="text-lg py-2 px-4 mb-2 bg-primary/10 text-primary"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Terima Kasih
                          </Badge>
                          <p className="text-sm font-medium">
                            Diklaim oleh {item.claimed_by}
                          </p>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      <h3
                        className="font-medium text-lg text-foreground mb-2 line-clamp-1"
                        title={item.name}
                      >
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {item.price && (
                        <p className="text-lg font-semibold text-primary mb-4">
                          {formatPrice(item.price)}
                        </p>
                      )}

                      <div className="mt-auto flex gap-2 pt-2">
                        {item.shop_link && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                          >
                            <a
                              href={item.shop_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Link Shopee
                            </a>
                          </Button>
                        )}

                        {!item.is_claimed && (
                          <Dialog
                            open={claimingId === item.id}
                            onOpenChange={(open) => {
                              setClaimingId(open ? item.id : null);
                              if (!open) setClaimerName("");
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" className="flex-1">
                                <Gift className="w-4 h-4 mr-1" />
                                Gift This
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Konfirmasi Klaim</DialogTitle>
                                <DialogDescription>
                                  Anda akan memberikan &quot;{item.name}&quot;.
                                  Masukkan nama Anda agar mempelai
                                  mengetahuinya.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                  <label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                  >
                                    Nama Anda
                                  </label>
                                  <Input
                                    id="name"
                                    placeholder="Contoh: Budi & Keluarga"
                                    value={claimerName}
                                    onChange={(e) =>
                                      setClaimerName(e.target.value)
                                    }
                                    autoFocus
                                  />
                                </div>
                                <Button
                                  onClick={() => handleClaim(item.id)}
                                  className="w-full"
                                  disabled={!claimerName.trim() || isSubmitting}
                                >
                                  {isSubmitting
                                    ? "Memproses..."
                                    : "Saya akan memberikan ini"}
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

      <FloralDivider className="mt-8" />

      {/* Bank Accounts */}
      <section className="py-8 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-2xl text-foreground text-center mb-6">
              Hubungi WhatsApp 0815-4114-0434 Untuk Info Lebih Lanjut
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bankAccounts.map((account, index) => (
                <Card key={account.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <p className="text-primary font-medium mb-2">
                      {account.bank_name}
                    </p>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="font-mono text-xl text-foreground">
                        {account.account_number}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(account.account_number, index)
                        }
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      a.n. {account.account_holder}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-border mt-8">
        <p className="font-serif text-xl text-foreground">
          Balqis <span className="text-primary">&</span> Erlan
        </p>
      </footer>
    </main>
  );
}
