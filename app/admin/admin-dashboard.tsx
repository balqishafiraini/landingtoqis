"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Calendar,
  Gift,
  MessageSquare,
  LogOut,
  Download,
  Plus,
  Trash2,
  Check,
  X,
  QrCode,
  Search,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface Guest {
  id: string
  name: string
  slug: string
  event_type: string
  has_rsvped: boolean
  created_at: string
}

interface RSVP {
  id: string
  guest_id: string
  event_type: string
  attendance_status: string
  guest_count: number
  created_at: string
  guests: { name: string } | null
}

interface Wish {
  id: string
  name: string
  message: string
  created_at: string
}

interface WishlistItem {
  id: string
  name: string
  category: string
  price: number | null
  is_claimed: boolean
  claimed_by: string | null
  priority: number
}

interface AdminDashboardProps {
  initialGuests: Guest[]
  initialRsvp: RSVP[]
  initialWishes: Wish[]
  initialWishlist: WishlistItem[]
  userEmail: string
}

export function AdminDashboard({
  initialGuests,
  initialRsvp,
  initialWishes,
  initialWishlist,
  userEmail,
}: AdminDashboardProps) {
  const router = useRouter()
  const [guests, setGuests] = useState(initialGuests)
  const [rsvp, setRsvp] = useState(initialRsvp)
  const [wishes, setWishes] = useState(initialWishes)
  const [wishlist, setWishlist] = useState(initialWishlist)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingGuest, setIsAddingGuest] = useState(false)
  const [newGuest, setNewGuest] = useState({ name: "", eventType: "both" })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const supabase = createClient()

  // Stats
  const totalGuests = guests.length
  const confirmedAttending = rsvp.filter((r) => r.attendance_status === "hadir").length
  const totalExpectedGuests = rsvp
    .filter((r) => r.attendance_status === "hadir")
    .reduce((sum, r) => sum + r.guest_count, 0)
  const pendingRsvp = guests.filter((g) => !g.has_rsvped).length
  const totalWishes = wishes.length
  const claimedGifts = wishlist.filter((w) => w.is_claimed).length

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const [guestsResult, rsvpResult, wishesResult, wishlistResult] = await Promise.all([
      supabase.from("guests").select("*").order("created_at", { ascending: false }),
      supabase.from("rsvp").select("*, guests(name)").order("created_at", { ascending: false }),
      supabase.from("wishes").select("*").order("created_at", { ascending: false }),
      supabase.from("wishlist").select("*").order("priority", { ascending: false }),
    ])

    if (guestsResult.data) setGuests(guestsResult.data)
    if (rsvpResult.data) setRsvp(rsvpResult.data)
    if (wishesResult.data) setWishes(wishesResult.data)
    if (wishlistResult.data) setWishlist(wishlistResult.data)
    setIsRefreshing(false)
  }

  const handleAddGuest = async () => {
    if (!newGuest.name.trim()) return

    const slug = newGuest.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const { data, error } = await supabase
      .from("guests")
      .insert({
        name: newGuest.name.trim(),
        slug,
        event_type: newGuest.eventType,
      })
      .select()
      .single()

    if (!error && data) {
      setGuests([data, ...guests])
      setNewGuest({ name: "", eventType: "both" })
      setIsAddingGuest(false)
    }
  }

  const handleDeleteGuest = async (id: string) => {
    const { error } = await supabase.from("guests").delete().eq("id", id)
    if (!error) {
      setGuests(guests.filter((g) => g.id !== id))
    }
  }

  const handleDeleteWish = async (id: string) => {
    const { error } = await supabase.from("wishes").delete().eq("id", id)
    if (!error) {
      setWishes(wishes.filter((w) => w.id !== id))
    }
  }

  const generateQRUrl = (guest: Guest) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const eventPath = guest.event_type === "jakarta" ? "/jakarta" : "/lampung"
    return `${baseUrl}${eventPath}?guest=${guest.slug}`
  }

  const exportToCSV = (data: object[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => JSON.stringify((row as Record<string, unknown>)[h] ?? "")).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredGuests = guests.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-foreground">Wedding Admin</h1>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalGuests}</p>
                  <p className="text-sm text-muted-foreground">Total Guests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalExpectedGuests}</p>
                  <p className="text-sm text-muted-foreground">Expected Attendees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalWishes}</p>
                  <p className="text-sm text-muted-foreground">Wishes Received</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {claimedGifts}/{wishlist.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Gifts Claimed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="guests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="rsvp">RSVP</TabsTrigger>
            <TabsTrigger value="wishes">Wishes</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          {/* Guests Tab */}
          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Guest List</CardTitle>
                    <CardDescription>Manage your wedding guests and generate QR codes</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(guests, "guests")}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Dialog open={isAddingGuest} onOpenChange={setIsAddingGuest}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Guest
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Guest</DialogTitle>
                          <DialogDescription>Enter the guest details to generate their invitation</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="guestName">Guest Name</Label>
                            <Input
                              id="guestName"
                              placeholder="Enter full name"
                              value={newGuest.name}
                              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventType">Event</Label>
                            <Select
                              value={newGuest.eventType}
                              onValueChange={(value) => setNewGuest({ ...newGuest, eventType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="both">Both Events</SelectItem>
                                <SelectItem value="lampung">Lampung Only</SelectItem>
                                <SelectItem value="jakarta">Jakarta Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddGuest} className="w-full">
                            Add Guest
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search guests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>RSVP Status</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell className="font-medium">{guest.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{guest.event_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {guest.has_rsvped ? (
                              <Badge className="bg-primary/10 text-primary border-0">
                                <Check className="w-3 h-3 mr-1" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <X className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(guest.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <QrCode className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>QR Code for {guest.name}</DialogTitle>
                                    <DialogDescription>Scan to open personalized invitation</DialogDescription>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center py-6">
                                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                                      <QrCode className="w-32 h-32 text-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground text-center break-all">
                                      {generateQRUrl(guest)}
                                    </p>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteGuest(guest.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RSVP Tab */}
          <TabsContent value="rsvp">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>RSVP Responses</CardTitle>
                    <CardDescription>
                      {confirmedAttending} confirmed, {pendingRsvp} pending
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(rsvp, "rsvp")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Guest Count</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rsvp.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.guests?.name || "Unknown"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{r.event_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {r.attendance_status === "hadir" ? (
                              <Badge className="bg-primary/10 text-primary border-0">Attending</Badge>
                            ) : (
                              <Badge variant="secondary">Not Attending</Badge>
                            )}
                          </TableCell>
                          <TableCell>{r.guest_count}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{formatDate(r.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishes Tab */}
          <TabsContent value="wishes">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Guest Wishes</CardTitle>
                    <CardDescription>{totalWishes} wishes received</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(wishes, "wishes")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wishes.map((wish) => (
                    <div key={wish.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-foreground">{wish.name}</p>
                            <span className="text-xs text-muted-foreground">{formatDate(wish.created_at)}</span>
                          </div>
                          <p className="text-muted-foreground text-sm">{wish.message}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteWish(wish.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Gift Wishlist</CardTitle>
                    <CardDescription>
                      {claimedGifts} of {wishlist.length} items claimed
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(wishlist, "wishlist")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Claimed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wishlist.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {item.price
                              ? new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                }).format(item.price)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {item.is_claimed ? (
                              <Badge className="bg-primary/10 text-primary border-0">Claimed</Badge>
                            ) : (
                              <Badge variant="secondary">Available</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{item.claimed_by || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
