"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, XCircle, ShieldAlert, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "already_used" | "unauthorized"
  >("loading");
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [checkInTime, setCheckInTime] = useState("");

  useEffect(() => {
    const performCheckIn = async () => {
      const rsvpId = params.id as string;
      const supabase = createClient();

      try {
        // ✅ CEK AUTHENTICATION DULU
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setStatus("unauthorized");
          setMessage(
            "Anda harus login sebagai admin untuk melakukan check-in."
          );
          return;
        }

        // 1. Cek Data Tamu
        const { data: rsvp, error: fetchError } = await supabase
          .from("rsvp")
          .select("*")
          .eq("id", rsvpId)
          .single();

        if (fetchError || !rsvp) {
          throw new Error("Data tamu tidak ditemukan atau QR Code invalid.");
        }

        setGuestName(rsvp.guest_name);

        // 2. ✅ CEK APAKAH SUDAH CHECK-IN (SECURITY!)
        if (rsvp.checked_in) {
          setStatus("already_used");
          setCheckInTime(
            new Date(rsvp.checked_in_at).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })
          );
          setMessage(
            `QR Code ini sudah pernah digunakan untuk check-in pada ${checkInTime}.`
          );
          return; // ❌ STOP - Tidak boleh check-in lagi
        }

        // 3. ✅ CEK APAKAH TAMU HADIR (Hanya yang konfirmasi hadir bisa check-in)
        if (!rsvp.attending) {
          setStatus("error");
          setMessage(
            "Tamu ini tidak konfirmasi kehadiran. Tidak bisa check-in."
          );
          return;
        }

        // 4. Update Check-in status
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
        setMessage(
          `Selamat datang! Tamu a.n ${rsvp.guest_name} (${rsvp.guest_count} orang) berhasil check-in.`
        );
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

          {status === "unauthorized" && (
            <div className="py-8 space-y-4">
              <Lock className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2>
              <p className="text-muted-foreground">{message}</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-800">
                  🔒 Hanya admin yang login yang dapat melakukan check-in tamu.
                </p>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() =>
                  router.push(
                    `/admin/login?redirect=/admin/check-in/${params.id}`
                  )
                }
              >
                Login Sebagai Admin
              </Button>
            </div>
          )}

          {status === "success" && (
            <div className="py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">
                Check-in Berhasil ✅
              </h2>
              <p className="text-lg font-medium">{guestName}</p>
              <p className="text-muted-foreground">{message}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  ⚠️ QR Code ini sudah tidak bisa digunakan lagi.
                </p>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => router.push("/admin")}
              >
                Kembali ke Dashboard
              </Button>
            </div>
          )}

          {status === "already_used" && (
            <div className="py-8 space-y-4">
              <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto" />
              <h2 className="text-2xl font-bold text-orange-600">
                QR Code Sudah Digunakan
              </h2>
              <p className="text-lg font-medium">{guestName}</p>
              <p className="text-muted-foreground">{message}</p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-orange-800 font-semibold">
                  ⚠️ PERHATIAN: QR Code ini sudah pernah di-scan
                </p>
                <p className="text-xs text-orange-700 mt-2">
                  Waktu check-in: {checkInTime}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Jika ini bukan Anda yang scan pertama kali, segera hubungi
                  panitia.
                </p>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => router.push("/admin")}
              >
                Kembali ke Dashboard
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-800">
                  Silakan hubungi penerima tamu untuk bantuan.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/admin")}
              >
                Kembali ke Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
