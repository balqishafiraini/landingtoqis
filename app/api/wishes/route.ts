import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    // Validasi input
    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // STEP 1: Cari guest di database by name (case-insensitive)
    const { data: existingGuest } = await supabase
      .from("guests")
      .select("id, event_type")
      .ilike("name", name.trim())
      .maybeSingle();

    // STEP 2: Insert wish dengan guest_id jika ada
    const { data: wish, error: insertError } = await supabase
      .from("wishes")
      .insert([
        {
          guest_id: existingGuest?.id || null,
          name: name.trim(),
          message: message.trim(),
          event_type: existingGuest?.event_type || null,
          is_approved: true,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: "Wish submitted successfully",
      wishId: wish.id,
    });

  } catch (error: any) {
    console.error("Wishes submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit wish" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all wishes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: wishes, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(wishes);
  } catch (error: any) {
    console.error("Error fetching wishes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wishes" },
      { status: 500 }
    );
  }
}

// DELETE endpoint for admin
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wishId = searchParams.get("id");

    if (!wishId) {
      return NextResponse.json(
        { error: "Wish ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("wishes")
      .delete()
      .eq("id", wishId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Wish deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting wish:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete wish" },
      { status: 500 }
    );
  }
}