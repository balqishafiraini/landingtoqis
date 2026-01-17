"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Search, ScanLine } from "lucide-react";

export default function QRScannerWidget() {
  const router = useRouter();
  const [manualId, setManualId] = useState("");

  const handleManualInput = () => {
    if (manualId.trim()) {
      // Extract ID dari URL atau gunakan langsung jika sudah ID
      let rsvpId = manualId.trim();

      // Jika user paste full URL, extract ID-nya
      if (rsvpId.includes("/check-in/")) {
        const parts = rsvpId.split("/check-in/");
        rsvpId = parts[parts.length - 1];
      }

      router.push(`/admin/check-in/${rsvpId}`);
    }
  };

  const handleScanClick = () => {
    // Untuk saat ini redirect ke halaman scan (bisa dikembangkan dengan react-qr-reader nanti)
    alert(
      "Tip: Paste URL QR Code atau RSVP ID di kolom input, lalu klik tombol cari."
    );
  };

  return (
    <Card className="mb-6 border-2 border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ScanLine className="w-5 h-5 text-primary" />
          Quick Check-in Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Paste QR Code URL atau RSVP ID..."
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualInput()}
            className="font-mono text-sm"
          />
          <Button
            onClick={handleManualInput}
            size="icon"
            disabled={!manualId.trim()}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleScanClick}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR dengan Kamera
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">💡 Tips:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Paste full URL dari QR Code atau copy RSVP ID</li>
            <li>Tekan Enter atau klik tombol cari</li>
            <li>Anda harus login untuk melakukan check-in</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
