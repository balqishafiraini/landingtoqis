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
    
    // [PENTING] Gunakan domain Vercel kamu agar link QR valid (bukan localhost)
    const publicDomain = "https://landingtoqis.com" 

    if (!name || !phone) {
       return NextResponse.json({ error: "Nama dan Nomor HP wajib diisi" }, { status: 400 })
    }

    const supabase = await createClient()
    let finalGuestId = guestId

    // ----------------------------------------------------------------
    // 1. BUAT TAMU BARU (Jika guestId belum ada)
    // ----------------------------------------------------------------
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
        console.error("❌ Guest Error:", guestError)
        return NextResponse.json({ error: "Gagal membuat data tamu" }, { status: 500 })
      }
      finalGuestId = newGuest.id
    }

    // ----------------------------------------------------------------
    // 2. SIMPAN RSVP KE DATABASE
    // ----------------------------------------------------------------
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
      .select("id") // PENTING: Kita butuh ID ini untuk bikin QR Code
      .single()

    if (rsvpError) {
      console.error("❌ RSVP Error:", rsvpError)
      return NextResponse.json({ error: "Gagal menyimpan RSVP: " + rsvpError.message }, { status: 500 })
    }

    // ----------------------------------------------------------------
    // 3. GENERATE QR CODE & UPDATE DATABASE (Bagian ini yang sebelumnya HILANG)
    // ----------------------------------------------------------------
    
    // Link khusus untuk Admin melakukan Check-in
    const checkInUrl = `${publicDomain}/admin/check-in/${rsvpData.id}`
    
    // Update kolom qr_code di database dengan link tersebut
    const { error: updateError } = await supabase
      .from("rsvp")
      .update({ qr_code: checkInUrl })
      .eq("id", rsvpData.id)
      
    if (updateError) console.error("❌ Gagal update QR ke DB:", updateError)

    // Generate URL Gambar QR Code (untuk dikirim ke WA)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkInUrl)}`

    // ----------------------------------------------------------------
    // 4. KIRIM WHATSAPP VIA FONNTE
    // ----------------------------------------------------------------
    if (isAttending) {
      console.log("▶️ Mengirim WA ke:", formatPhoneNumber(phone))
      
      const fonnteToken = "TbTg6qzmiVDg5aCXSvuq" // Token Kamu
      
      const message = `Halo ${name},\n\nTerima kasih telah melakukan konfirmasi kehadiran.\n\nBerikut adalah QR Code akses masuk Anda.\nHarap tunjukkan QR Code ini kepada penerima tamu saat acara.\n\nSampai jumpa!`

      const formData = new FormData()
      formData.append("target", formatPhoneNumber(phone))
      formData.append("message", message)
      formData.append("url", qrImageUrl) 
      formData.append("filename", "qr-code.png") // [FIX] Wajib ada agar terkirim sebagai gambar
      formData.append("countryCode", "62")

      try {
        // Kirim request ke Fonnte (tanpa await agar user tidak menunggu lama)
        fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: { Authorization: fonnteToken },
          body: formData,
        })
      } catch (e) {
        console.error("❌ Gagal kirim WA:", e)
      }
    }

    // Kembalikan URL QR ke frontend agar bisa ditampilkan di layar "Terima Kasih"
    return NextResponse.json({ success: true, qrImageUrl })
    
  } catch (error: any) {
    console.error("❌ System Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}