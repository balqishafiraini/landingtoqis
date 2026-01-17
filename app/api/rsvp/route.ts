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

   const supabase = await createClient();

    // ========================================
    // STEP 1: Cari atau Buat Guest di Database
    // ========================================
    let finalGuestId = guestId;

    // Cari guest by name (case-insensitive)
    const { data: existingGuest, error: guestFindError } = await supabase
      .from("guests")
      .select("id, phone, has_rsvped")
      .ilike("name", name.trim())
      .maybeSingle();

    if (existingGuest) {
      // Guest sudah ada di database
      finalGuestId = existingGuest.id;

      // Update phone jika masih kosong DAN update has_rsvped
      const updateData: any = { 
        has_rsvped: true,
        updated_at: new Date().toISOString()
      };
      
      if (!existingGuest.phone || existingGuest.phone === "") {
        updateData.phone = phone;
      }

      await supabase
        .from("guests")
        .update(updateData)
        .eq("id", existingGuest.id);

    } else if (!finalGuestId) {
      // Guest belum ada, buat baru (walk-in guest)
      const slug =
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Math.floor(Math.random() * 1000);

      const { data: newGuest, error: guestError } = await supabase
        .from("guests")
        .insert({
          name: name.trim(),
          phone: phone,
          event_type: eventType || "both",
          invitation_slug: slug,
          has_rsvped: true,
        })
        .select("id")
        .single();

      if (guestError) {
        console.error("Error creating guest:", guestError);
        return NextResponse.json(
          { error: "Gagal membuat data tamu" },
          { status: 500 }
        );
      }

      finalGuestId = newGuest.id;
    }

    // ========================================
    // STEP 2: Check Existing RSVP (UPSERT Logic)
    // ========================================
    const isAttending = attendance === "hadir";

    // Cari RSVP yang sudah ada berdasarkan guest_name dan event_type
    const { data: existingRsvp, error: rsvpFindError } = await supabase
      .from("rsvp")
      .select("id, qr_code")
      .eq("guest_name", name.trim())
      .eq("event_type", eventType)
      .maybeSingle();

    let rsvpId: string;
    let checkInUrl: string;
    let isUpdate = false;

    if (existingRsvp) {
      // ========================================
      // RSVP SUDAH ADA → UPDATE
      // ========================================
      isUpdate = true;
      rsvpId = existingRsvp.id;
      checkInUrl = existingRsvp.qr_code || `${publicDomain}/admin/check-in/${rsvpId}`;

      const { error: updateError } = await supabase
        .from("rsvp")
        .update({
          guest_id: finalGuestId,
          phone: phone,
          attending: isAttending,
          guest_count: isAttending ? guestCount : 0,
        })
        .eq("id", rsvpId);

      if (updateError) {
        console.error("Error updating RSVP:", updateError);
        return NextResponse.json(
          { error: "Gagal update RSVP: " + updateError.message },
          { status: 500 }
        );
      }

      console.log(`✅ RSVP UPDATED for ${name} (${eventType})`);

    } else {
      // ========================================
      // RSVP BELUM ADA → INSERT BARU
      // ========================================
      rsvpId = randomUUID();
      checkInUrl = `${publicDomain}/admin/check-in/${rsvpId}`;

      const { error: insertError } = await supabase
        .from("rsvp")
        .insert({
          id: rsvpId,
          guest_id: finalGuestId,
          guest_name: name.trim(),
          phone: phone,
          event_type: eventType,
          attending: isAttending,
          guest_count: isAttending ? guestCount : 0,
          checked_in: false,
          qr_code: checkInUrl,
        });

      if (insertError) {
        console.error("Error creating RSVP:", insertError);
        return NextResponse.json(
          { error: "Gagal menyimpan RSVP: " + insertError.message },
          { status: 500 }
        );
      }

      console.log(`✅ NEW RSVP CREATED for ${name} (${eventType})`);
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
            ? 
`*Akad Nikah & Walimatul Ursy*

Tanggal: 23 Mei 2026
Waktu: 
08.00 - 10.00 WIB (Akad)
10.00 - 14.00 (Walimatul Ursy)
Tempat: Kediaman Bapak Lili Zainal
Jl. Romowijoyo No. 56, Sawah Lama, Tanjung Karang Timur, Bandar Lampung
Maps: https://maps.app.goo.gl/Hp6SbNi72Lm6wAXPA`

            : eventType === "jakarta"
            ? 
`*Reception – Outdoor Garden Evening Party*

Tanggal: 1 Juni 2026
Waktu: 16.00 - 19.30 WIB
Tempat: Villa Srimanganti
Jl. Raya PKP No.34 2, RT.2/RW.8, Klp. Dua Wetan, Kec. Ciracas, Jakarta Timur
Maps: https://maps.app.goo.gl/nWQiJHJrwhafYwf89`
            : `*Akad Nikah & Resepsi*`;

        const message = `Halo *${name}*,

Terima kasih telah melakukan konfirmasi kehadiran pada acara pernikahan kami.

*QR Code Akses Masuk*
Klik link di bawah ini untuk melihat tiket QR Code Anda:
${qrImageUrl}

Harap tunjukkan QR Code tersebut kepada penerima tamu saat kedatangan.

${eventDetail}

Jumlah tamu: *${guestCount} orang*

Hormat kami,
_Balqis & Erlan_`;

        // ✅ KIRIM VIA FONNTE DENGAN URL LANGSUNG
        const fonntePayload = {
          target: formatPhoneNumber(phone),
          message: message,
          url: qrImageUrl, // ← PAKAI URL LANGSUNG
          filename: "qr-code-invitation.png", // <--- TAMBAHKAN INI
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