import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = "https://furrsgjfbhzqbtwuwnik.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cnJzZ2pmYmh6cWJ0d3V3bmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzMzMzcsImV4cCI6MjA4NDA0OTMzN30.RbjqHFBkoYSmpkYXZPplflhxdDBinmfsznnWFl9TR04"

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => 
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // REFRESH SESSION - INI PENTING!
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect ALL /admin routes KECUALI /admin/login
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("redirect", request.nextUrl.pathname) // Simpan URL tujuan
      return NextResponse.redirect(url)
    }
  }

  // Jika sudah login, redirect dari /admin/login ke /admin
  if (request.nextUrl.pathname === "/admin/login" && session) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}