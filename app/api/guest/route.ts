import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// API to get guest by slug (for personalized links)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Try to find guest by slug
    const { data: guest, error } = await supabase
      .from("guests")
      .select("id, name, slug, phone, email, event_type, max_guests")
      .eq("slug", slug.toLowerCase())
      .single()

    if (error || !guest) {
      // If not found in database, format the slug as name
      const formattedName = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

      return NextResponse.json({
        name: formattedName,
        isRegistered: false,
      })
    }

    return NextResponse.json({
      id: guest.id,
      name: guest.name,
      slug: guest.slug,
      phone: guest.phone,
      email: guest.email,
      eventType: guest.event_type,
      maxGuests: guest.max_guests,
      isRegistered: true,
    })
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}
