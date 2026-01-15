"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface InvitationEnvelopeProps {
  guestName?: string
  onOpen: () => void
}

export function InvitationEnvelope({ guestName = "Tamu Undangan", onOpen }: InvitationEnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false)

  const handleOpen = () => {
    setIsOpening(true)
    setTimeout(() => {
      onOpen()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {!isOpening ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center px-6 text-center">
            {/* Decorative top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <svg className="w-24 h-24 text-primary opacity-60" viewBox="0 0 100 100" fill="none">
                <path d="M50 10 C30 30, 10 50, 50 90 C90 50, 70 30, 50 10Z" fill="currentColor" />
              </svg>
            </motion.div>

            {/* Invitation text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-lg mb-2"
            >
              Kepada Yth.
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="font-serif text-3xl md:text-4xl text-foreground mb-2"
            >
              {guestName}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-muted-foreground mb-8"
            >
              Anda diundang ke pernikahan
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-8"
            >
              <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                Balqis <span className="text-primary">&</span> Erlan
              </h1>
            </motion.div>

            {/* Open button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Buka Undangan
            </motion.button>

            {/* Decorative bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <svg className="w-24 h-24 text-secondary opacity-60 rotate-180" viewBox="0 0 100 100" fill="none">
                <path d="M50 10 C30 30, 10 50, 50 90 C90 50, 70 30, 50 10Z" fill="currentColor" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
            transition={{ duration: 1.5 }}
            className="text-center"
          >
            <h1 className="font-serif text-5xl text-foreground">
              Balqis <span className="text-primary">&</span> Erlan
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
