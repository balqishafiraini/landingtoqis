import Image from "next/image"
import { ScrollReveal } from "./scroll-reveal"
import { FloralDivider } from "./floral-divider"

interface Person {
  name: string
  fullName: string
  parents: string
  image: string
  instagram?: string
}

interface CoupleSectionProps {
  bride: Person
  groom: Person
}

export function CoupleSection({ bride, groom }: CoupleSectionProps) {
  return (
    <section className="py-16 md:py-24 px-6 bg-card">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-muted-foreground text-lg mb-2">Bismillahirrahmanirrahim</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Assalamualaikum Wr. Wb.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri
            acara pernikahan kami:
          </p>
        </ScrollReveal>

        <FloralDivider className="my-8" />

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          {/* Bride */}
          <ScrollReveal delay={200}>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-secondary shadow-lg mb-6">
                <Image src={bride.image || "/placeholder.svg"} alt={bride.name} fill className="object-cover" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">{bride.name}</h3>
              <p className="text-muted-foreground text-lg mb-2">{bride.fullName}</p>
              <p className="text-sm text-muted-foreground">{bride.parents}</p>
              {bride.instagram && (
                <a
                  href={`https://instagram.com/${bride.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-primary hover:underline text-sm"
                >
                  @{bride.instagram}
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Ampersand */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <span className="font-serif text-6xl text-primary opacity-30">&</span>
          </div>
          <div className="md:hidden flex justify-center my-4">
            <span className="font-serif text-4xl text-primary opacity-50">&</span>
          </div>

          {/* Groom */}
          <ScrollReveal delay={400}>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-secondary shadow-lg mb-6">
                <Image src={groom.image || "/placeholder.svg"} alt={groom.name} fill className="object-cover" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">{groom.name}</h3>
              <p className="text-muted-foreground text-lg mb-2">{groom.fullName}</p>
              <p className="text-sm text-muted-foreground">{groom.parents}</p>
              {groom.instagram && (
                <a
                  href={`https://instagram.com/${groom.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-primary hover:underline text-sm"
                >
                  @{groom.instagram}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
