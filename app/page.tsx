"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InvitationEnvelope } from "@/components/wedding/invitation-envelope";
import { FloatingPetals } from "@/components/wedding/floating-petals";
import { MusicPlayer } from "@/components/wedding/music-player";
import { CountdownTimer } from "@/components/wedding/countdown-timer";
import { ScrollReveal } from "@/components/wedding/scroll-reveal";
import { FloralDivider } from "@/components/wedding/floral-divider";
import { WeddingFooter } from "@/components/wedding/footer";
import { WEDDING_DATA } from "@/lib/wedding-data";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  // First event date for countdown (Lampung Akad)
  const countdownDate = new Date(WEDDING_DATA.events.lampung.akad.dateTime);

  if (!isOpen) {
    return <InvitationEnvelope onOpen={() => setIsOpen(true)} />;
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <FloatingPetals count={12} />
      <MusicPlayer />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url(/placeholder.svg?height=1080&width=1920&query=elegant floral wedding background sage green dusty rose)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-muted-foreground text-lg md:text-xl mb-4"
          >
            The Wedding of
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 text-balance"
          >
            {WEDDING_DATA.bride.name}
            <span className="block text-primary my-2">&</span>
            {WEDDING_DATA.groom.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <FloralDivider />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl mb-8"
          >
            #LANdingtoQIS
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <CountdownTimer
              targetDate={countdownDate}
              label="Menghitung hari menuju hari bahagia"
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Events Overview */}
      <section className="py-16 md:py-24 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Calendar className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Rangkaian Acara
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Kami mengundang Anda untuk merayakan cinta kami dalam dua acara
                istimewa
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Lampung Event Card */}
            <ScrollReveal delay={200}>
              <Card className="bg-background border-border overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: "url(/akad.jpg?height=400&width=600)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      Lampung
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-2xl text-foreground mb-2">
                    Akad Nikah & Walimatul Ursy
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Sabtu, 23 Mei 2026
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Acara sakral dan resepsi di kampung halaman mempelai wanita
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Jakarta Event Card */}
            <ScrollReveal delay={400}>
              <Card className="bg-background border-border overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: "url(/resepsi.jpg?height=400&width=600",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      Jakarta
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-2xl text-foreground mb-2">
                    Wedding Reception
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Monday, 1 June 2026
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    A modern celebration with friends and family in Jakarta
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-6 italic">
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia
              menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu
              cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di
              antaramu rasa kasih dan sayang.&rdquo;
            </blockquote>
            <p className="text-muted-foreground">— QS. Ar-Rum: 21</p>
          </ScrollReveal>
        </div>
      </section>

      <WeddingFooter />
    </main>
  );
}
