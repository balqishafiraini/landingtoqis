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
        qr_code: checkInUrl
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
        // Download gambar QR dari API
        const imageResponse = await fetch(qrImageUrl)
        
        if (!imageResponse.ok) {
          throw new Error(`Gagal download QR: ${imageResponse.status}`)
        }
        
        // Convert ke base64
        const imageBuffer = await imageResponse.arrayBuffer()
        const base64Image = Buffer.from(imageBuffer).toString('base64')
        const base64DataUrl = `data:image/png;base64,${base64Image}`

        // Pesan WA
        const message = `Halo *${name}*,

Terima kasih telah melakukan konfirmasi kehadiran untuk acara pernikahan kami! 🎉

*Berikut adalah QR Code akses masuk Anda:*
Harap tunjukkan QR Code ini kepada penerima tamu saat acara berlangsung.

Jumlah tamu: *${guestCount} orang*
Acara: *${eventType === 'akad' ? 'Akad Nikah' : eventType === 'resepsi' ? 'Resepsi' : 'Akad & Resepsi'}*

Sampai jumpa di hari bahagia kami! 💕

_Balqis & Erlan_`

        // Kirim via Fonnte (FORMAT JSON)
        const fonntePayload = {
          target: formatPhoneNumber(phone),
          message: message,
          file: base64DataUrl, // ← BASE64 STRING
          filename: "qr-code.png",
          countryCode: "62"
        }

        console.log("🚀 Sending to Fonnte with target:", fonntePayload.target)

        const fonnteResponse = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: { 
            "Authorization": fonnteToken,
            "Content-Type": "application/json" // ← PENTING!
          },
          body: JSON.stringify(fonntePayload)
        })
        
        const fonnteResult = await fonnteResponse.json()
        
        if (fonnteResult.status) {
          console.log("✅ WA berhasil dikirim:", fonnteResult)
        } else {
          console.error("❌ Fonnte error:", fonnteResult)
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