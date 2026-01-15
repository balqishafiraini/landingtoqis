import { WishlistClient } from "./wishlist-client"

// --- DATA HARDCODE (EDIT DI SINI) ---

const MOCK_BANK_ACCOUNTS = [
  {
    id: "bank-1",
    bank_name: "BCA",
    account_number: "2920649168",
    account_holder: "Balqis Shafira Aini",
  },
  {
    id: "bank-2",
    bank_name: "Mandiri",
    account_number: "1270014558603",
    account_holder: "Balqis Shafira Aini",
  },
]

const MOCK_WISHLIST_ITEMS = [
  {
    id: "item-1",
    name: "Philips Air Fryer",
    description: "Untuk memasak lebih sehat dengan sedikit minyak.",
    price: 1200000,
    image_url: "https://images.unsplash.com/photo-1626162232386-3f11d95dc352?w=800&q=80",
    shop_link: "https://www.tokopedia.com/find/air-fryer",
    is_claimed: false,
    claimed_by: null,
  },
  {
    id: "item-2",
    name: "Bed Cover Set King Size",
    description: "Sprei dan Bedcover bahan katun jepang ukuran 180x200.",
    price: 850000,
    image_url: "https://images.unsplash.com/photo-1522771753035-4a5047124f5c?w=800&q=80",
    shop_link: "https://shopee.co.id",
    is_claimed: true, // Contoh yang sudah diklaim
    claimed_by: "Tante Sarah",
  },
  {
    id: "item-3",
    name: "Robot Vacuum Cleaner",
    description: "Penyedot debu otomatis untuk lantai rumah.",
    price: 3500000,
    image_url: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&q=80",
    shop_link: "https://tokopedia.com",
    is_claimed: false,
    claimed_by: null,
  },
  {
    id: "item-4",
    name: "Coffee Maker Espresso",
    description: "Mesin kopi rumahan untuk pagi yang lebih semangat.",
    price: 2100000,
    image_url: "https://images.unsplash.com/photo-1517088455829-9e0d19e6eb7b?w=800&q=80",
    shop_link: "https://tokopedia.com",
    is_claimed: false,
    claimed_by: null,
  },
  {
    id: "item-5",
    name: "Microwave Oven",
    description: "Untuk menghangatkan makanan dengan praktis.",
    price: 1500000,
    image_url: "https://images.unsplash.com/photo-1585514020922-b5b7b952f447?w=800&q=80",
    shop_link: null,
    is_claimed: false,
    claimed_by: null,
  },
]

export const metadata = {
  title: "Wedding Wishlist | Balqis & Erlan",
  description: "Daftar kado pernikahan impian kami.",
}

export default function WishlistPage() {
  // Langsung kirim data Mock ke Client
  return (
    <WishlistClient 
      initialItems={MOCK_WISHLIST_ITEMS} 
      bankAccounts={MOCK_BANK_ACCOUNTS} 
    />
  )
}