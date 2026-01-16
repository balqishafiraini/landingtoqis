import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Pastikan phone diambil dari body
    const { name, phone, attendance, guestCount, eventType, guestId } = body

    // Validasi sederhana
    if (!name || !phone) {
       return NextResponse.json({ error: "Nama dan Nomor HP wajib diisi" }, { status: 400 })
    }

    const supabase = await createClient()

    let finalGuestId = guestId

    // 1. Jika tidak ada guestId (Tamu Baru), Buat Guest Dulu
    if (!finalGuestId) {
      // Bikin slug simple dari nama + angka random biar unik
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000)

      const { data: newGuest, error: guestError } = await supabase
        .from("guests")
        .insert({
          name: name,
          phone: phone, // Masukkan phone ke tabel guest juga
          event_type: eventType || "both",
          invitation_slug: slug, // WAJIB ADA sesuai schema database
        })
        .select("id")
        .single()

      if (guestError) {
        console.error("Error creating guest:", guestError)
        return NextResponse.json({ error: "Gagal membuat data tamu" }, { status: 500 })
      }

      finalGuestId = newGuest.id
    }

    // 2. Insert ke tabel RSVP
    // Mapping: "hadir" -> true, "tidak_hadir" -> false
    const isAttending = attendance === "hadir"

    const { error: rsvpError } = await supabase.from("rsvp").insert({
      guest_id: finalGuestId,
      guest_name: name, // WAJIB ADA sesuai schema database
      phone: phone,     // WAJIB ADA sesuai schema database
      event_type: eventType,
      attending: isAttending, // Ubah ke boolean (bukan attendance_status string)
      guest_count: isAttending ? guestCount : 0,
    })

    if (rsvpError) {
      console.error("Error creating RSVP:", rsvpError)
      return NextResponse.json({ error: "Gagal menyimpan RSVP: " + rsvpError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
    
  } catch (error: any) {
    console.error("RSVP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}