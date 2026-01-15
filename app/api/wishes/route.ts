import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: wishes, error } = await supabase
      .from("wishes")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching wishes:", error)
      return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 })
    }

    return NextResponse.json(wishes)
  } catch (error) {
    console.error("Wishes GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, message } = body

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("wishes").insert({
      name: name.trim(),
      message: message.trim(),
    })

    if (error) {
      console.error("Error creating wish:", error)
      return NextResponse.json({ error: "Failed to submit wish" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishes POST API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
