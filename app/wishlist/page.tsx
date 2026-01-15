import { createClient } from "@/lib/supabase/server"
import { WishlistClient } from "./wishlist-client"

export const metadata = {
  title: "Wedding Wishlist | Balqis & Erlan",
  description: "Daftar kado pernikahan impian kami.",
}

// Agar data selalu fresh (tidak dicache) saat ada yang claim
export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const supabase = await createClient()

  // 1. Ambil data Wishlist dari Database
  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select("*")
    .order("created_at", { ascending: false })

  // 2. Ambil data Bank dari Database
  const { data: bankAccounts } = await supabase
    .from("bank_accounts")
    .select("*")
    .order("created_at", { ascending: true })

  return (
    <WishlistClient 
      initialItems={wishlistItems || []} 
      bankAccounts={bankAccounts || []} 
    />
  )
}