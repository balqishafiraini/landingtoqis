import { createClient } from "@/lib/supabase/server"
import { WishlistClient } from "./wishlist-client"

export const metadata = {
  title: "Wedding Wishlist | Balqis & Erlan",
  description: "Browse our wedding gift wishlist and help us start our new life together",
}

export default async function WishlistPage() {
  const supabase = await createClient()

  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select("*")
    .order("priority", { ascending: false })
    .order("name", { ascending: true })

  const { data: bankAccounts } = await supabase.from("bank_accounts").select("*")

  return <WishlistClient initialItems={wishlistItems || []} bankAccounts={bankAccounts || []} />
}
