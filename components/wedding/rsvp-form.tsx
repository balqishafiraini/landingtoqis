"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Users, Lock } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import Image from "next/image";

interface RSVPFormProps {
  eventType: "lampung" | "jakarta";
  guestId?: string;
}

export function RSVPForm({ eventType, guestId }: RSVPFormProps) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    attendance: "hadir",
    guestCount: "1",
  });

  // GET GUEST NAME FROM URL PARAMETER
  useEffect(() => {
    const toParam = searchParams.get("to");
    if (toParam) {
      const decodedName = decodeURIComponent(toParam);
      setGuestName(decodedName);
      setFormData((prev) => ({ ...prev, name: decodedName }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengirim RSVP");
      }

      if (result.qrImageUrl) {
        setQrCodeUrl(result.qrImageUrl);
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("RSVP submission error:", error);
      alert("Gagal: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS VIEW
  if (isSubmitted) {
    return (
      <ScrollReveal>
        <Card className="bg-card border-border max-w-md mx-auto">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Terima Kasih!
            </h3>
            <p className="text-muted-foreground mb-6">
              Konfirmasi kehadiran Anda telah kami terima.
              {qrCodeUrl && " QR Code juga telah dikirim ke WhatsApp Anda."}
            </p>

            {qrCodeUrl && formData.attendance === "hadir" && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Tunjukkan QR ini saat datang
                </p>
                <div className="relative w-48 h-48 mx-auto">
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code Tamu"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}

            <Button variant="outline" onClick={() => window.location.reload()}>
              Isi Lagi
            </Button>
          </CardContent>
        </Card>
      </ScrollReveal>
    );
  }

  // FORM VIEW
  return (
    <ScrollReveal>
      <Card className="bg-card border-border max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <CardTitle className="font-serif text-2xl text-foreground">
            Konfirmasi Kehadiran
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Mohon konfirmasi kehadiran Anda
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LOCKED NAME FIELD */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                Nama Lengkap
                {guestName && (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Lock className="w-3 h-3" />
                    Terkunci
                  </span>
                )}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  !guestName &&
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={guestName ? guestName : "Masukkan nama Anda"}
                required
                readOnly={!!guestName}
                className={guestName ? "bg-gray-100 cursor-not-allowed" : ""}
              />
              {guestName && (
                <p className="text-xs text-muted-foreground">
                  📌 Nama terkunci sesuai undangan
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp / HP</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Contoh: 08123456789"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Apakah Anda akan hadir?</Label>
              <RadioGroup
                value={formData.attendance}
                onValueChange={(value) =>
                  setFormData({ ...formData, attendance: value })
                }
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
                  <RadioGroupItem
                    value="hadir"
                    id="hadir"
                    className="sr-only"
                  />
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
                  <RadioGroupItem
                    value="tidak_hadir"
                    id="tidak_hadir"
                    className="sr-only"
                  />
                  <span className="text-foreground">Maaf, Tidak</span>
                </Label>
              </RadioGroup>
            </div>

            {formData.attendance === "hadir" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Jumlah Tamu
                </Label>
                <Select
                  value={formData.guestCount.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, guestCount: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih jumlah tamu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Orang</SelectItem>
                    <SelectItem value="2">2 Orang</SelectItem>
                  </SelectContent>
                </Select>
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
  );
}
