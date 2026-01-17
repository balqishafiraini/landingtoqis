import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { randomUUID } from "crypto"

// Helper format nomor HP
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
    
    // Konfigurasi
    const publicDomain = "https://www.landingtoqis.com" 
    const fonnteToken = "TbTg6qzmiVDg5aCXSvuq" // Pastikan token ini aktif

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
        qr_code: checkInUrl
      })

    if (rsvpError) {
      return NextResponse.json({ error: "Gagal menyimpan RSVP: " + rsvpError.message }, { status: 500 })
    }

    // Link QR Code Generator
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(checkInUrl)}`

    // 4. KIRIM WA (Hanya jika hadir)
    if (isAttending) {
      console.log("Mulai proses kirim WA ke:", phone)

      try {
        // [UPDATE PENTING] Fetch gambar dulu di server (bukan di Fonnte)
        // Ini memastikan gambar benar-benar ada fisiknya sebelum dikirim
        const imageRes = await fetch(qrImageUrl)
        
        if (!imageRes.ok) throw new Error("Gagal download gambar QR")
        
        const imageBuffer = await imageRes.arrayBuffer()
        const imageBlob = new Blob([imageBuffer], { type: 'image/png' })

        const message = `Halo ${name},\n\nTerima kasih telah melakukan konfirmasi kehadiran.\n\nBerikut adalah QR Code akses masuk Anda.\nHarap tunjukkan QR Code ini kepada penerima tamu saat acara.\n\nSampai jumpa!`

        const formData = new FormData()
        formData.append("target", formatPhoneNumber(phone))
        formData.append("message", message)
        
        // Kirim sebagai FILE fisik, bukan URL
        formData.append("file", imageBlob, "qrcode.png") 
        formData.append("countryCode", "62")

        // Kirim ke Fonnte
        const waReq = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: { Authorization: fonnteToken },
          body: formData,
        })
        
        const waRes = await waReq.json()
        console.log("Status WA Fonnte:", waRes)

      } catch (e) {
        console.error("Gagal kirim WA (Error di blok try/catch):", e)
        // Kita tidak return error di sini agar user tetap dapat success response (karena RSVP database sudah masuk)
      }
    }

    return NextResponse.json({ success: true, qrImageUrl })
    
  } catch (error: any) {
    console.error("RSVP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}