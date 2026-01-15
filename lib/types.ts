export interface Guest {
  id: string
  name: string
  phone: string | null
  email: string | null
  event_type: "lampung" | "jakarta" | "both"
  invitation_slug: string
  created_at: string
  updated_at: string
}

export interface RSVP {
  id: string
  guest_id: string | null
  guest_name: string
  phone: string
  event_type: "lampung" | "jakarta"
  attending: boolean
  guest_count: number
  qr_code: string | null
  checked_in: boolean
  checked_in_at: string | null
  created_at: string
  updated_at: string
}

export interface Wish {
  id: string
  guest_id: string | null
  guest_name: string
  message: string
  event_type: "lampung" | "jakarta"
  is_approved: boolean
  created_at: string
}

export interface WishlistItem {
  id: string
  name: string
  description: string | null
  image_url: string | null
  price: number | null
  shop_link: string | null
  is_claimed: boolean
  claimed_by: string | null
  claimed_at: string | null
  created_at: string
  updated_at: string
}

export interface BankAccount {
  id: string
  bank_name: string
  account_number: string
  account_holder: string
  is_active: boolean
  created_at: string
}

export interface WeddingEvent {
  type: "lampung" | "jakarta"
  title: string
  date: Date
  location: {
    name: string
    address: string
    mapUrl: string
  }
}

export interface CoupleInfo {
  bride: {
    name: string
    fullName: string
    father: string
    mother: string
    childOrder: string
  }
  groom: {
    name: string
    fullName: string
    father: string
    mother: string
    childOrder: string
  }
}
