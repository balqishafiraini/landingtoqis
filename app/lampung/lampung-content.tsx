"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { InvitationEnvelope } from "@/components/wedding/invitation-envelope"
import { FloatingPetals } from "@/components/wedding/floating-petals"
import { MusicPlayer } from "@/components/wedding/music-player"
import { CountdownTimer } from "@/components/wedding/countdown-timer"
import { ScrollReveal } from "@/components/wedding/scroll-reveal"
import { FloralDivider } from "@/components/wedding/floral-divider"
import { CoupleSection } from "@/components/wedding/couple-section"
import { EventCard } from "@/components/wedding/event-card"
import { RSVPForm } from "@/components/wedding/rsvp-form"
import { WishesSection } from "@/components/wedding/wishes-section"
import { GiftSection } from "@/components/wedding/gift-section"
import { WeddingFooter } from "@/components/wedding/footer"
import { WEDDING_DATA } from "@/lib/wedding-data"

const QRIS_IMAGE_URL = "/qris-wedding.jpg"

export default function LampungContent() {
  const [isOpen, setIsOpen] = useState(false)
  const [guestName, setGuestName] = useState<string>("Guest")
  const searchParams = useSearchParams()

  useEffect(() => {
    const guestSlug = searchParams.get("to")
    if (guestSlug) {
      fetch(`/api/guest?slug=${encodeURIComponent(guestSlug)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.name) {
            setGuestName(data.name)
          }
        })
        .catch(() => {
          setGuestName(guestSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))
        })
    }
  }, [searchParams])

  const akadDate = new Date(WEDDING_DATA.events.lampung.akad.dateTime)

  const bankAccounts = [
    {
      bank_name: "Bank Central Asia (BCA)",
      account_number: "2920649168",
      account_holder: "Balqis Shafira Aini",
    },
    {
      bank_name: "Bank Mandiri",
      account_number: "1270014558603",
      account_holder: "Balqis Shafira Aini",
    },
  ]

  if (!isOpen) {
    return <InvitationEnvelope guestName={guestName} onOpen={() => setIsOpen(true)} />
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <FloatingPetals count={10} />
      <MusicPlayer />

      {/* Hero Section - Minimalist Traditional */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage:
              "url(/placeholder.svg?height=1080&width=1920&query=traditional Indonesian batik pattern subtle elegant)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <p className="text-muted-foreground text-base tracking-widest uppercase">Bismillahirrahmanirrahim</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground text-lg mb-4"
          >
            Undangan Pernikahan
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl text-foreground mb-4 text-balance"
          >
            {WEDDING_DATA.bride.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-serif text-4xl text-primary mb-4"
          >
            &
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-foreground mb-8 text-balance"
          >
            {WEDDING_DATA.groom.name}
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
            <FloralDivider />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8"
          >
            <p className="text-muted-foreground text-lg mb-2">Akad Nikah & Walimatul Ursy</p>
            <p className="font-serif text-2xl text-foreground">Sabtu, 23 Mei 2026</p>
            <p className="text-muted-foreground mt-2">Bandar Lampung</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-12"
          >
            <CountdownTimer targetDate={akadDate} label="Menghitung hari menuju hari bahagia" />
          </motion.div>
        </div>
      </section>

      {/* Couple Section */}
      <CoupleSection
        bride={{
          name: WEDDING_DATA.bride.name,
          fullName: WEDDING_DATA.bride.fullName,
          parents: WEDDING_DATA.bride.parents,
          image: "/bridemuslim.jpg",
        }}
        groom={{
          name: WEDDING_DATA.groom.name,
          fullName: WEDDING_DATA.groom.fullName,
          parents: WEDDING_DATA.groom.parents,
          image: "/groommuslim.jpg",
        }}
      />

      {/* Events Section */}
      <section className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Rangkaian Acara</h2>
              <p className="text-muted-foreground">Berikut adalah rangkaian acara pernikahan kami di Lampung</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <EventCard
              title="Akad Nikah"
              date="Sabtu, 23 Mei 2026"
              time="08:00 - 10:00 WIB"
              venue={WEDDING_DATA.events.lampung.akad.venue}
              address={WEDDING_DATA.events.lampung.akad.address}
              mapUrl={WEDDING_DATA.events.lampung.akad.mapUrl}
              delay={200}
            />
            <EventCard
              title="Walimatul Ursy"
              date="Sabtu, 23 Mei 2026"
              time="10:00 - 14:00 WIB"
              venue={WEDDING_DATA.events.lampung.walimah.venue}
              address={WEDDING_DATA.events.lampung.walimah.address}
              mapUrl={WEDDING_DATA.events.lampung.walimah.mapUrl}
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Konfirmasi Kehadiran</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Mohon konfirmasi kehadiran Anda untuk membantu kami dalam mempersiapkan acara
              </p>
            </div>
          </ScrollReveal>

          <RSVPForm eventType="lampung" />
        </div>
      </section>

      {/* Wishes Section */}
      <WishesSection />

      {/* Gift Section */}
      <GiftSection bankAccounts={bankAccounts} qrisImageUrl={QRIS_IMAGE_URL} />

      {/* Quote Section */}
      <section className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-6 italic">
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu
              sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan
              sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang
              berfikir.&rdquo;
            </blockquote>
            <p className="text-muted-foreground">— QS. Ar-Rum: 21</p>
          </ScrollReveal>
        </div>
      </section>

      <WeddingFooter />
    </main>
  )
}
