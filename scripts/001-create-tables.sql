-- Wedding Invitation Database Schema
-- Run this script to create all necessary tables

-- 1. Guests table - stores all invited guests
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('lampung', 'jakarta', 'both')),
  invitation_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RSVP table - stores RSVP responses
CREATE TABLE IF NOT EXISTS rsvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('lampung', 'jakarta')),
  attending BOOLEAN DEFAULT true,
  guest_count INTEGER DEFAULT 1,
  qr_code TEXT,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Guestbook/Wishes table - stores wishes from guests
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('lampung', 'jakarta')),
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Wishlist/Gift Registry table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(12, 2),
  shop_link TEXT,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bank Accounts table - for gift transfers
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Admin users table (for dashboard access)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guests_event_type ON guests(event_type);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_slug ON guests(invitation_slug);
CREATE INDEX IF NOT EXISTS idx_rsvp_guest_id ON rsvp(guest_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_event_type ON rsvp(event_type);
CREATE INDEX IF NOT EXISTS idx_rsvp_qr_code ON rsvp(qr_code);
CREATE INDEX IF NOT EXISTS idx_wishes_event_type ON wishes(event_type);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for guests (by invitation slug)
CREATE POLICY "Allow public read by slug" ON guests 
  FOR SELECT USING (true);

-- Public insert for RSVP
CREATE POLICY "Allow public insert rsvp" ON rsvp 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read rsvp" ON rsvp 
  FOR SELECT USING (true);

-- Public access for wishes (read and insert)
CREATE POLICY "Allow public read wishes" ON wishes 
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow public insert wishes" ON wishes 
  FOR INSERT WITH CHECK (true);

-- Public read for wishlist
CREATE POLICY "Allow public read wishlist" ON wishlist 
  FOR SELECT USING (true);

CREATE POLICY "Allow public update wishlist claim" ON wishlist 
  FOR UPDATE USING (true);

-- Public read for bank accounts
CREATE POLICY "Allow public read bank_accounts" ON bank_accounts 
  FOR SELECT USING (is_active = true);
