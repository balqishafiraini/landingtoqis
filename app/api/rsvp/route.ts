import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, attendance, guestCount, eventType, guestId } = body

    const supabase = await createClient()

    // If no guestId, create a new guest first
    let finalGuestId = guestId

    if (!finalGuestId) {
      const { data: newGuest, error: guestError } = await supabase
        .from("guests")
        .insert({
          name,
          event_type: eventType,
        })
        .select("id")
        .single()

      if (guestError) {
        console.error("Error creating guest:", guestError)
        return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
      }

      finalGuestId = newGuest.id
    }

    // Insert RSVP
    const { error: rsvpError } = await supabase.from("rsvp").insert({
      guest_id: finalGuestId,
      event_type: eventType,
      attendance_status: attendance,
      guest_count: attendance === "hadir" ? guestCount : 0,
    })

    if (rsvpError) {
      console.error("Error creating RSVP:", rsvpError)
      return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
    }

    // Update guest RSVP status
    await supabase.from("guests").update({ has_rsvped: true }).eq("id", finalGuestId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("RSVP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
