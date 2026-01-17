import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { randomUUID } from "crypto"

// Helper format nomor HP
function formatPhoneNumber(phone: string) {
  let formatted = phone.replace(/\D/g, "")
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.slice(1)
  } else if (!formatted.startsWith("62")) {
    formatted = "62" + formatted
  }
  return formatted
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, attendance, guestCount, eventType, guestId } = body
    
    // Konfigurasi
    const publicDomain = "https://www.landingtoqis.com" 
    const fonnteToken = "TbTg6qzmiVDg5aCXSvuq"

    if (!name || !phone) {
       return NextResponse.json({ error: "Nama dan Nomor HP wajib diisi" }, { status: 400 })
    }

    const supabase = await createClient()
    let finalGuestId = guestId

    // 1. Buat Guest (Jika belum ada)
    if (!finalGuestId) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000)
      const { data: newGuest, error: guestError } = await supabase
        .from("guests")
        .insert({
          name: name,
          phone: phone,
          event_type: eventType || "both",
          invitation_slug: slug,
        })
        .select("id")
        .single()

      if (guestError) {
        console.error("Error creating guest:", guestError)
        return NextResponse.json({ error: "Gagal membuat data tamu" }, { status: 500 })
      }
      finalGuestId = newGuest.id
    }

    // 2. Generate ID & Link Check-in
    const rsvpId = randomUUID()
    const checkInUrl = `${publicDomain}/admin/check-in/${rsvpId}`
    const isAttending = attendance === "hadir"
    
    // 3. Insert RSVP ke Supabase
    const { error: rsvpError } = await supabase
      .from("rsvp")
      .insert({
        id: rsvpId, 
        guest_id: finalGuestId,
        guest_name: name,
        phone: phone,
        event_type: eventType,
        attending: isAttending,
        guest_count: isAttending ? guestCount : 0,
        checked_in: false,
        qr_code: checkInUrl,
      })

    if (rsvpError) {
      console.error("Error creating RSVP:", rsvpError)
      return NextResponse.json({ error: "Gagal menyimpan RSVP: " + rsvpError.message }, { status: 500 })
    }

    // 4. Generate QR Code URL
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&data=${encodeURIComponent(checkInUrl)}`

    // 5. KIRIM WA (Hanya jika hadir)
    if (isAttending) {
      console.log("📱 Mulai proses kirim WA ke:", formatPhoneNumber(phone))

      try {
        // Event detail berdasarkan tipe
        const eventDetail =
          eventType === "lampung"
            ? `*Akad Nikah & Walimatul Ursy*
Bertempat di Kediaman Bapak Lili Zainal
Jl. Romowijoyo No. 56, Sawah Lama
Tanjung Karang Timur, Bandar Lampung
Maps: https://maps.app.goo.gl/Hp6SbNi72Lm6wAXPA`
            : eventType === "jakarta"
            ? `*Reception – Outdoor Garden Party (Evening)*
Villa Srimanganti
Jl. Raya PKP No.34 2, RT.2/RW.8
Klp. Dua Wetan, Kec. Ciracas
Jakarta Timur, DKI Jakarta
Maps: https://maps.app.goo.gl/nWQiJHJrwhafYwf89`
            : `*Akad Nikah & Resepsi*`;

        const message = `Halo *${name}*,

Terima kasih telah melakukan konfirmasi kehadiran pada acara pernikahan kami.

${eventDetail}

Jumlah tamu: *${guestCount} orang*

*QR Code Akses Masuk*
Silakan tunjukkan QR Code ini kepada penerima tamu saat acara berlangsung.

Hormat kami,
_Balqis & Erlan_`;

        // ✅ KIRIM VIA FONNTE DENGAN URL LANGSUNG
        const fonntePayload = {
          target: formatPhoneNumber(phone),
          message: message,
          url: qrImageUrl, // ← PAKAI URL LANGSUNG
          countryCode: "62"
        }

        console.log("🚀 Sending to Fonnte...")
        console.log("   Target:", fonntePayload.target)
        console.log("   QR URL:", qrImageUrl)

        const fonnteResponse = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: { 
            "Authorization": fonnteToken,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(fonntePayload)
        })
        
        const fonnteResult = await fonnteResponse.json()
        
        console.log("📤 Fonnte Response:", JSON.stringify(fonnteResult, null, 2))
        
        if (fonnteResult.status) {
          console.log("✅ WA berhasil dikirim!")
        } else {
          console.error("❌ Fonnte error:", fonnteResult.reason || fonnteResult.message || "Unknown error")
        }

      } catch (waError: any) {
        console.error("❌ Error saat kirim WA:", waError.message)
        // Jangan return error, biar RSVP tetap sukses
      }
    } else {
      console.log("ℹ️ Tamu tidak hadir, skip kirim WA")
    }

    // 6. Return success dengan QR URL
    return NextResponse.json({ 
      success: true, 
      qrImageUrl,
      message: isAttending ? "RSVP berhasil! QR Code telah dikirim ke WhatsApp." : "RSVP berhasil!"
    })
    
  } catch (error: any) {
    console.error("💥 RSVP API error:", error)
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 })
  }
}