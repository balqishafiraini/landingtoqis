import type React from "react"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Balqis & Erlan Wedding",
  description:
    "We are getting married! Join us in celebrating our love story. Akad & Walimah in Lampung, Reception in Jakarta.",
  keywords: ["wedding", "invitation", "Balqis", "Erlan", "marriage", "celebration"],
  authors: [{ name: "Balqis & Erlan" }],
  openGraph: {
    title: "Balqis & Erlan Wedding",
    description: "We are getting married! Join us in celebrating our love story.",
    type: "website",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#7a9e7e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${playfair.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
