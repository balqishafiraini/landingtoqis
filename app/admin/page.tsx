import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "./admin-dashboard"

export const metadata = {
  title: "Admin Dashboard | Balqis & Erlan Wedding",
  description: "Manage wedding guests, RSVPs, and wishlist",
}

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch all data
  const [guestsResult, rsvpResult, wishesResult, wishlistResult] = await Promise.all([
    supabase.from("guests").select("*").order("created_at", { ascending: false }),
    supabase.from("rsvp").select("*, guests(name)").order("created_at", { ascending: false }),
    supabase.from("wishes").select("*").order("created_at", { ascending: false }),
    supabase.from("wishlist").select("*").order("priority", { ascending: false }),
  ])

  return (
    <AdminDashboard
      initialGuests={guestsResult.data || []}
      initialRsvp={rsvpResult.data || []}
      initialWishes={wishesResult.data || []}
      initialWishlist={wishlistResult.data || []}
      userEmail={user.email || ""}
    />
  )
}
