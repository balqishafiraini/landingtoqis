import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Helper format nomor HP ke 62
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
    
    // [PENTING] Ganti ini dengan domain Vercel kamu yang asli
    // Agar saat QR discan HP Admin, langsung membuka website yang benar (bukan localhost)
    const publicDomain = "https://landingtoqis.com" 

    console.log("▶️ [DEBUG] Memulai RSVP untuk:", name, phone)

    if (!name || !phone) {
       return NextResponse.json({ error: "Nama dan Nomor HP wajib diisi" }, { status: 400 })
    }

    const supabase = await createClient()
    let finalGuestId = guestId

    // 1. Buat Guest (Jika baru)
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
        console.error("❌ [ERROR] Gagal create guest:", guestError)
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
      console.error("❌ [ERROR] Gagal save RSVP:", rsvpError)
      return NextResponse.json({ error: "Gagal menyimpan RSVP: " + rsvpError.message }, { status: 500 })
    }

    // 3. Generate QR Link (Gunakan Public Domain agar bisa discan)
    const checkInUrl = `${publicDomain}/admin/check-in/${rsvpData.id}`
    
    await supabase
      .from("rsvp")
      .update({ qr_code: checkInUrl })
      .eq("id", rsvpData.id)

    // Link Gambar QR
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkInUrl)}`

    // 4. KIRIM WA
    if (isAttending) {
      console.log("▶️ [DEBUG] Mencoba kirim WA ke:", formatPhoneNumber(phone))
      
      const fonnteToken = "TbTg6qzmiVDg5aCXSvuq" // Token kamu
      
      const message = `Halo ${name},\n\nTerima kasih telah melakukan konfirmasi kehadiran.\n\nBerikut adalah QR Code akses masuk Anda.\nHarap tunjukkan QR Code ini kepada penerima tamu saat acara.\n\nSampai jumpa!`

      const formData = new FormData()
      formData.append("target", formatPhoneNumber(phone))
      formData.append("message", message)
      formData.append("url", qrImageUrl)
      
      // [FIX UTAMA] Tambahkan filename agar Fonnte tahu ini gambar
      formData.append("filename", "qr-code.png") 
      
      formData.append("countryCode", "62")

      try {
        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: { Authorization: fonnteToken },
          body: formData,
        })

        const responseText = await response.text()
        console.log("📡 [FONNTE RESPONSE]:", responseText) 

      } catch (e) {
        console.error("❌ [FONNTE ERROR]:", e)
      }
    }

    return NextResponse.json({ success: true, qrImageUrl })
    
  } catch (error: any) {
    console.error("❌ [SYSTEM ERROR]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}