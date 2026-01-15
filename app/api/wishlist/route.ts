import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: items, error } = await supabase
      .from("wishlist")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching wishlist:", error)
      return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
    }

    return NextResponse.json(items)
  } catch (error) {
    console.error("Wishlist GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
