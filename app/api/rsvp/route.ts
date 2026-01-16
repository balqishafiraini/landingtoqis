import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Helper format nomor HP ke 62 (Syarat Fonnte)
function formatPhoneNumber(phone: string) {
  let formatted = phone.replace(/\D/g, "")
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.slice(1)
  }
  return formatted
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, attendance, guestCount, eventType, guestId } = body
    
    // Gunakan domain public agar QR valid
    const publicDomain = "https://landingtoqis.com" 

    if (!name || !phone) {
       return NextResponse.json({ error: "Nama dan Nomor HP wajib diisi" }, { status: 400 })
    }

    const supabase = await createClient()
    let finalGuestId = guestId

    // 1. Handle Guest Baru
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
        return NextResponse.json({ error: "Gagal membuat data tamu" }, { status: 500 })
      }
      finalGuestId = newGuest.id
    }

    // 2. Simpan RSVP
    const isAttending = attendance === "hadir"
    
    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvp")
      .insert({
        guest_id: finalGuestId,
        guest_name: name,
        phone: phone,
        event_type: eventType,
        attending: isAttending,
        guest_count: isAttending ? guestCount : 0,
        checked_in: false 
      })
      .select("id")
      .single()

    if (rsvpError) {
      return NextResponse.json({ error: "Gagal menyimpan RSVP: " + rsvpError.message }, { status: 500 })
    }

    // 3. Generate QR Code
    const checkInUrl = `${publicDomain}/admin/check-in/${rsvpData.id}`
    
    // Update DB dengan QR Link
    await supabase
      .from("rsvp")
      .update({ qr_code: checkInUrl })
      .eq("id", rsvpData.id)

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkInUrl)}`

    // 4. KIRIM WA (Wajib pakai Await & Token Benar)
    if (isAttending) {
      // Token yang kamu kasih di awal chat
      const fonnteToken = "33nfMH5zXXQe3YpUuAscCtPB9fQPkcGLZkBaSLTDF" 
      
      const message = `Halo ${name},\n\nTerima kasih telah melakukan konfirmasi kehadiran.\n\nBerikut adalah QR Code akses masuk Anda.\nHarap tunjukkan QR Code ini kepada penerima tamu saat acara.\n\nSampai jumpa!`

      const formData = new FormData()
      formData.append("target", formatPhoneNumber(phone))
      formData.append("message", message)
      formData.append("url", qrImageUrl) 
      formData.append("filename", "qr-code.png") // Wajib ada filename
      formData.append("countryCode", "62")

      try {
        // [FIX] Tambahkan AWAIT agar Vercel tidak memutus koneksi sebelum terkirim
        const res = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: { Authorization: fonnteToken },
          body: formData,
        })
        console.log("Fonnte Status:", await res.text())
      } catch (e) {
        console.error("Gagal kirim WA:", e)
      }
    }

    return NextResponse.json({ success: true, qrImageUrl })
    
  } catch (error: any) {
    console.error("RSVP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}