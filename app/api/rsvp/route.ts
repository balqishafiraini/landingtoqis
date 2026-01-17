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
    
    // [UPDATE] Pastikan domain menggunakan https://www.landingtoqis.com (sesuai link yg kamu kasih)
    const publicDomain = "https://www.landingtoqis.com" 

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

    // 3. Generate Link Check-in
    const checkInUrl = `${publicDomain}/admin/check-in/${rsvpData.id}`
    
    // Update DB dengan link QR
    await supabase
      .from("rsvp")
      .update({ qr_code: checkInUrl })
      .eq("id", rsvpData.id)

    // [GANTI PROVIDER] Gunakan QuickChart (lebih stabil untuk Fonnte)
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(checkInUrl)}&size=300&margin=1&dark=000000&light=ffffff`

    // 4. KIRIM WA (Penting: Await & Filename)
    if (isAttending) {
      const fonnteToken = "TbTg6qzmiVDg5aCXSvuq" // Token Kamu
      
      const message = `Halo ${name},\n\nTerima kasih telah melakukan konfirmasi kehadiran.\n\nBerikut adalah QR Code akses masuk Anda.\nHarap tunjukkan QR Code ini kepada penerima tamu saat acara.\n\nSampai jumpa!`

      const formData = new FormData()
      formData.append("target", formatPhoneNumber(phone))
      formData.append("message", message)
      formData.append("url", qrImageUrl) 
      formData.append("filename", "qr-code.png") // Wajib untuk gambar
      formData.append("countryCode", "62")

      try {
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

    // Kembalikan URL QR ke frontend
    return NextResponse.json({ success: true, qrImageUrl })
    
  } catch (error: any) {
    console.error("RSVP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}