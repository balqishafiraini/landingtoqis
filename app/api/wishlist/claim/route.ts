import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, claimedBy } = body

    if (!itemId || !claimedBy?.trim()) {
      return NextResponse.json({ error: "Item ID and claimer name are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already claimed
    const { data: existing } = await supabase.from("wishlist").select("is_claimed").eq("id", itemId).single()

    if (existing?.is_claimed) {
      return NextResponse.json({ error: "This item has already been claimed" }, { status: 400 })
    }

    // Update the item
    const { error } = await supabase
      .from("wishlist")
      .update({
        is_claimed: true,
        claimed_by: claimedBy.trim(),
      })
      .eq("id", itemId)

    if (error) {
      console.error("Error claiming item:", error)
      return NextResponse.json({ error: "Failed to claim item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishlist claim API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
