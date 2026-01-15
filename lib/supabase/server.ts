import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  // --- MASUKKAN KUNCI ASLI DI SINI (JANGAN KOSONG) ---
  const supabaseUrl = "https://furrsgjfbhzqbtwuwnik.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cnJzZ2pmYmh6cWJ0d3V3bmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzMzMzcsImV4cCI6MjA4NDA0OTMzN30.RbjqHFBkoYSmpkYXZPplflhxdDBinmfsznnWFl9TR04"
  // ----------------------------------------------------

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
        }
      },
    },
  })
}