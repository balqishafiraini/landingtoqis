"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const performCheckIn = async () => {
      const rsvpId = params.id as string;
      const supabase = createClient();

      try {
        // 1. Cek Data Tamu
        const { data: rsvp, error: fetchError } = await supabase
          .from("rsvp")
          .select("*")
          .eq("id", rsvpId)
          .single();

        if (fetchError || !rsvp) {
          throw new Error("Data tamu tidak ditemukan.");
        }

        setGuestName(rsvp.guest_name);

        // 2. Cek apakah sudah check-in sebelumnya
        if (rsvp.checked_in) {
          setStatus("success"); // Tetap sukses tapi beri info
          setMessage(
            `Tamu a.n ${
              rsvp.guest_name
            } SUDAH check-in sebelumnya pada ${new Date(
              rsvp.checked_in_at
            ).toLocaleTimeString()}.`
          );
          return;
        }

        // 3. Update Check-in status
        const { error: updateError } = await supabase
          .from("rsvp")
          .update({
            checked_in: true,
            checked_in_at: new Date().toISOString(),
          })
          .eq("id", rsvpId);

        if (updateError) {
          throw new Error("Gagal melakukan update check-in.");
        }

        setStatus("success");
        setMessage(`Berhasil! Tamu a.n ${rsvp.guest_name} telah check-in.`);
      } catch (error: any) {
        console.error(error);
        setStatus("error");
        setMessage(error.message || "Terjadi kesalahan sistem.");
      }
    };

    performCheckIn();
  }, [params.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6 text-center">
          {status === "loading" && (
            <div className="py-8">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold">Memproses Check-in...</h2>
            </div>
          )}

          {status === "success" && (
            <div className="py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">
                Check-in Sukses
              </h2>
              <p className="text-lg font-medium">{guestName}</p>
              <p className="text-muted-foreground">{message}</p>
              <Button
                className="w-full mt-4"
                onClick={() => router.push("/admin")}
              >
                Kembali ke Dashboard Admin
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="py-8 space-y-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-red-600">
                Gagal Check-in
              </h2>
              <p className="text-muted-foreground">{message}</p>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
