import { Calendar, Clock, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollReveal } from "./scroll-reveal"

interface EventCardProps {
  title: string
  date: string
  time: string
  venue: string
  address: string
  mapUrl: string
  calendarUrl?: string
  delay?: number
}

export function EventCard({ title, date, time, venue, address, mapUrl, calendarUrl, delay = 0 }: EventCardProps) {
  return (
    <ScrollReveal delay={delay}>
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-6 text-center">{title}</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-medium text-foreground">{date}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-medium text-foreground">{time}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-medium text-foreground">{venue}</p>
                <p className="text-sm text-muted-foreground mt-1">{address}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild variant="default" className="flex-1">
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-4 h-4 mr-2" />
                Lihat Lokasi
              </a>
            </Button>
            {calendarUrl && (
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-4 h-4 mr-2" />
                  Simpan Tanggal
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}
