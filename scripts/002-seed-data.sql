-- Seed initial data for the wedding invitation

-- Insert bank accounts
INSERT INTO bank_accounts (bank_name, account_number, account_holder, is_active) VALUES
  ('BCA', '2920649168', 'Balqis Shafira Aini', true),
  ('Mandiri', '1270014558603', 'Balqis Shafira Aini', true),
ON CONFLICT DO NOTHING;

-- Insert sample wishlist items
INSERT INTO wishlist (name, description, image_url, price, shop_link, is_claimed) VALUES
  ('Set Peralatan Masak', 'Set lengkap peralatan masak untuk rumah tangga baru', '/placeholder.svg?height=200&width=200', 1500000, 'https://tokopedia.com', false),
  ('Vacuum Cleaner', 'Vacuum cleaner cordless untuk kebersihan rumah', '/placeholder.svg?height=200&width=200', 2500000, 'https://shopee.co.id', false),
  ('Coffee Maker', 'Mesin kopi otomatis untuk pecinta kopi', '/placeholder.svg?height=200&width=200', 3000000, 'https://tokopedia.com', false),
  ('Bed Sheet Set', 'Set sprei dan bed cover premium', '/placeholder.svg?height=200&width=200', 800000, 'https://shopee.co.id', false),
  ('Air Fryer', 'Air fryer untuk memasak sehat tanpa minyak', '/placeholder.svg?height=200&width=200', 1200000, 'https://tokopedia.com', false),
  ('Dinnerware Set', 'Set piring dan mangkuk keramik premium', '/placeholder.svg?height=200&width=200', 900000, 'https://shopee.co.id', false)
ON CONFLICT DO NOTHING;

-- Insert sample guests for testing
INSERT INTO guests (name, phone, email, event_type, invitation_slug) VALUES
  ('Bapak & Ibu Ahmad', '081234567890', null, 'lampung', 'bapak-ibu-ahmad'),
  ('Keluarga Besar Suharto', '081234567891', null, 'lampung', 'keluarga-suharto'),
  ('Sarah & Family', '081234567892', 'sarah@email.com', 'jakarta', 'sarah-family'),
  ('Michael Chen', '081234567893', 'michael@email.com', 'jakarta', 'michael-chen'),
  ('Keluarga Wijaya', '081234567894', null, 'both', 'keluarga-wijaya')
ON CONFLICT DO NOTHING;
