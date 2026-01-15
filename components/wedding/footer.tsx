import { Heart } from "lucide-react"

export function WeddingFooter() {
  return (
    <footer className="py-12 px-6 bg-muted/30 text-center">
      <div className="max-w-4xl mx-auto">
        <p className="font-serif text-2xl md:text-3xl text-foreground mb-4">
          Balqis <span className="text-primary">&</span> Erlan
        </p>
        <p className="text-muted-foreground mb-6">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan
          memberikan doa restu.
        </p>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-accent fill-current" />
          <span>by Bride & Groom</span>
        </div>
        <p className="text-xs text-muted-foreground mt-4">© 2026 Balqis & Erlan Wedding</p>
      </div>
    </footer>
  )
}
