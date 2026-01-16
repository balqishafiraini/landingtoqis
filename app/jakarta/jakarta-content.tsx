"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, Clock, MapPin, Navigation, Sparkles, Heart, Camera, Gift, PartyPopper, QrCode, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvitationEnvelope } from "@/components/wedding/invitation-envelope"
import { MusicPlayer } from "@/components/wedding/music-player"
import { CountdownTimer } from "@/components/wedding/countdown-timer"
import { ScrollReveal } from "@/components/wedding/scroll-reveal"
import { RSVPForm } from "@/components/wedding/rsvp-form"
import { WishesSection } from "@/components/wedding/wishes-section"
import { WEDDING_DATA } from "@/lib/wedding-data"

const QRIS_IMAGE_URL = "/qris-wedding.jpg"

export default function JakartaContent() {
  const [isOpen, setIsOpen] = useState(false)
  const [guestName, setGuestName] = useState<string>("You're Invited!")
  const searchParams = useSearchParams()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

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

  const receptionDate = new Date(WEDDING_DATA.events.jakarta.reception.dateTime)

  const bankAccounts = [
    {
      bank_name: "Bank Central Asia (BCA)",
      account_number: "2920649168",
      account_holder: "Balqis Shafira Aini",
    },
    {
      bank_name: "Bank Mandiri",
      account_number: " 1270014558603",
      account_holder: "Balqis Shafira Aini",
    },
  ]

  const [showQris, setShowQris] = useState(false)

  if (!isOpen) {
    return <InvitationEnvelope guestName={guestName} onOpen={() => setIsOpen(true)} />
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <MusicPlayer />

      {/* Hero Section - Modern & Dynamic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, var(--background) 0%, var(--muted) 50%, var(--card) 100%)",
          }}
        />

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full opacity-10"
              style={{
                background: i % 2 === 0 ? "var(--primary)" : "var(--secondary)",
                left: `${(i * 20) % 100}%`,
                top: `${(i * 15) % 100}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary font-medium text-lg tracking-widest uppercase mb-4"
          >
            Wedding Reception
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl text-foreground mb-6"
          >
            <span className="block">{WEDDING_DATA.bride.name}</span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
              className="inline-block text-primary text-5xl md:text-6xl my-4"
            >
              &
            </motion.span>
            <span className="block">{WEDDING_DATA.groom.name}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-muted-foreground text-xl md:text-2xl mb-4"
          >
            #LANdingtoQIS
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground mb-12"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Monday, 1 June 2026
            </span>
            <span className="hidden md:block">|</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Jakarta
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <CountdownTimer targetDate={receptionDate} label="Counting down to the celebration" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
        </motion.div>
      </section>

      {/* About Section - Bento Grid Style */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Meet the Couple</h2>
              <p className="text-muted-foreground text-lg">Two hearts, one beautiful journey</p>
            </div>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bride Card */}
            <ScrollReveal delay={100}>
              <Card className="bg-background border-border overflow-hidden h-full">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src="/balqis.jpg"
                      alt={WEDDING_DATA.bride.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-primary text-sm font-medium mb-1">{WEDDING_DATA.bride.name}</p>
                      <h3 className="font-serif text-2xl text-foreground">{WEDDING_DATA.bride.fullName}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{WEDDING_DATA.bride.parents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Love Story Card */}
            <ScrollReveal delay={200}>
              <Card className="bg-primary text-primary-foreground border-0 overflow-hidden h-full">
                <CardContent className="p-6 flex flex-col justify-center h-full min-h-[300px]">
                  <Heart className="w-10 h-10 mb-4 opacity-80" />
                  <h3 className="font-serif text-2xl mb-4">Our Story</h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    From strangers to soulmates, our journey has been nothing short of magical. Every moment together
                    has been a blessing, and we can&apos;t wait to start this new chapter with all of you by our side.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Groom Card */}
            <ScrollReveal delay={300}>
              <Card className="bg-background border-border overflow-hidden h-full">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src="/erlan.jpg"
                      alt={WEDDING_DATA.groom.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-primary text-sm font-medium mb-1">{WEDDING_DATA.groom.name}</p>
                      <h3 className="font-serif text-2xl text-foreground">{WEDDING_DATA.groom.fullName}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{WEDDING_DATA.groom.parents}</p>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Event Details - Modern Cards */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <PartyPopper className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">The Celebration</h2>
              <p className="text-muted-foreground text-lg">Join us for an unforgettable evening</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Image Side */}
                  <div className="aspect-video md:aspect-auto relative">
                    <Image
                      src="/villa.jpg"
                      alt="Venue"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details Side */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="font-serif text-3xl text-foreground mb-6">Wedding Reception</h3>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Monday, 1 June 2026</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">16.00 - 19.30 WIB</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{WEDDING_DATA.events.jakarta.reception.venue}</p>
                          <p className="text-muted-foreground text-sm mt-1">
                            {WEDDING_DATA.events.jakarta.reception.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <Button asChild className="flex-1">
                        <a
                          href={WEDDING_DATA.events.jakarta.reception.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </a>
                      </Button>
                      <a 
                      href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Balqis+%26+Erlan&dates=20260601T093000Z/20260601T123000Z&details=Wedding+Celebration&location=Villa+Srimanganti+Jl.+Raya+Pkp+No.34+2,+RT.2/RW.8,+Klp.+Dua+Wetan,+Kec.+Ciracas,+Kota+Jakarta+Timur,+DKI+Jakarta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1" // Ensures the anchor takes up the same space as the button
                      >
                        <Button variant="outline" className="w-full bg-transparent">
                          <Calendar className="w-4 h-4 mr-2" />
                          Add to Calendar
                          </Button>
                          </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Dress Code */}
          <ScrollReveal delay={300}>
            <Card className="bg-muted/50 border-border mt-6">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-2">Dress Code</p>
                <p className="font-serif text-xl text-foreground">Formal / Cocktail Attire</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Suggested colors: Sage Green, Dusty Rose, Champagne
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Moments - Video Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Film className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Our Moments</h2>
              <p className="text-muted-foreground text-lg">The beginning of our forever</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-xl overflow-hidden shadow-2xl bg-black border border-border">
              <video 
                controls 
                className="w-full h-auto aspect-video" 
                src="/proposal.mp4"
                poster="/thumbnail.jpg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Section - 4 Photos */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Camera className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Gallery</h2>
              <p className="text-muted-foreground text-lg">Snapshots of our journey together</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Photo 1 - Portrait */}
            <ScrollReveal delay={200}>
              <div className="md:col-span-1 aspect-[3/4] relative rounded-xl overflow-hidden group">
                <Image
                  src="/gallery1.jpg"
                  alt="Gallery 2"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </ScrollReveal>

            {/* Photo 2 - Portrait */}
            <ScrollReveal delay={300}>
              <div className="md:col-span-1 aspect-[3/4] relative rounded-xl overflow-hidden group">
                <Image
                  src="/gallery2.jpg"
                  alt="Gallery 3"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </ScrollReveal>
            {/* Photo 3 - Portrait */}
            <ScrollReveal delay={300}>
              <div className="md:col-span-1 aspect-[3/4] relative rounded-xl overflow-hidden group">
                <Image
                  src="/gallery3.jpg"
                  alt="Gallery 3"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">RSVP</h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Please let us know if you&apos;ll be joining our celebration
              </p>
            </div>
          </ScrollReveal>

          <RSVPForm eventType="jakarta" />
        </div>
      </section>

      {/* Wishes Section */}
      <WishesSection />

      {/* Gift Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Wedding Gift</h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Your presence is the greatest gift, but if you wish to bless us further:
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <Card className="bg-background border-border mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <QrCode className="w-5 h-5 text-primary" />
                  QRIS - Scan to Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div
                  className="relative w-64 h-64 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowQris(true)}
                >
                  <Image
                    src={QRIS_IMAGE_URL || "/placeholder.svg"}
                    alt="QRIS Code for transfer"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3">Tap to enlarge</p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {bankAccounts.map((account, index) => (
              <ScrollReveal key={index} delay={(index + 1) * 150}>
                <BankCard account={account} index={index} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <div className="text-center mt-12 mb-8">
              <p className="font-serif font-bold text-xl md:text-2xl text-primary mb-8 italic max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                Your love and presence are the greatest gifts.
                <br />
                But if you&apos;d like to add a little magic to our new home,
                <br />
                we&apos;ve created a wishlist of things we&apos;d truly cherish.
                </p>

              <Button 
                asChild 
                className="h-auto py-6 px-12 text-xl font-medium rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 border-2 border-primary/20"
              >
                <Link href="/wishlist">View Gift Wishlist</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {showQris && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQris(false)}
        >
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src={QRIS_IMAGE_URL || "/placeholder.svg"}
              alt="QRIS Code for transfer"
              fill
              className="object-contain"
            />
          </div>
          <button className="absolute top-4 right-4 text-white text-xl" onClick={() => setShowQris(false)}>
            ✕
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 bg-muted/30 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <p className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            {WEDDING_DATA.bride.name} <span className="text-primary">&</span> {WEDDING_DATA.groom.name}
          </p>
          <p className="text-muted-foreground mb-6">
            Thank you for being part of our love story. We can&apos;t wait to celebrate with you!
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-current" />
            <span>for our special day</span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">© 2026 #BalqisErlanForever</p>
        </motion.div>
      </footer>
    </main>
  )
}

// Bank Card Component
function BankCard({
  account,
  index,
}: { account: { bank_name: string; account_number: string; account_holder: string }; index: number }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account.account_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-background border-border">
      <CardContent className="p-6">
        <p className="text-primary font-medium mb-3">{account.bank_name}</p>
        <div className="flex items-center justify-between gap-4 mb-3">
          <p className="font-mono text-2xl text-foreground">{account.account_number}</p>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">a.n. {account.account_holder}</p>
      </CardContent>
    </Card>
  )
}