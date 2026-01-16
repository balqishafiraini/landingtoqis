import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Masukkan kunci manual di sini juga
  const supabaseUrl = "https://furrsgjfbhzqbtwuwnik.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub24iLCJpYXQiOjE3Njg0NzMzMzcsImV4cCI6MjA4NDA0OTMzN30.RbjqHFBkoYSmpkYXZPplflhxdDBinmfsznnWFl9TR04"

  return createBrowserClient(supabaseUrl, supabaseKey)
}