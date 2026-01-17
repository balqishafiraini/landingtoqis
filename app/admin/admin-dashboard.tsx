"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  MessageSquare,
  CheckCircle2,
  Search,
  LogOut,
  Loader2,
  Trash2,
  UserPlus,
  Copy,
  Check,
  Camera,
  ScanLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Import QR Scanner Component
import { QRScanner } from "@/components/wedding/qr-scanner";

type Guest = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  event_type: string;
  invitation_slug: string;
  created_at: string;
};

type Rsvp = {
  id: string;
  guest_name: string;
  attending: boolean;
  guest_count: number;
  event_type: string;
  checked_in: boolean;
  qr_code: string | null;
};

type Wish = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // STATE DATA
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  // STATE LOADING & SEARCH
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // STATE MODAL & SCANNER
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // STATE FORM ADD GUEST
  const [newGuest, setNewGuest] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "wedding" as string,
  });

  // FETCH DATA
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resGuests, resRsvp, resWishes] = await Promise.all([
        supabase
          .from("guests")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("rsvp")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("wishes")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (resGuests.data) setGuests(resGuests.data);
      if (resRsvp.data) setRsvps(resRsvp.data);
      if (resWishes.data) setWishes(resWishes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Gagal memuat data",
        description: "Periksa koneksi internet Anda.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // GENERATE SLUG FROM NAME
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();
  };

  // GENERATE INVITATION LINK
  const generateInvitationLink = (name: string, eventType: string) => {
    const encodedName = encodeURIComponent(name);
    const baseUrl = window.location.origin;
    return `${baseUrl}/${eventType}?to=${encodedName}`;
  };

  // HANDLE ADD GUEST
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGuest.name.trim()) {
      toast({
        title: "Error",
        description: "Nama guest harus diisi!",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = generateSlug(newGuest.name);

      const { data, error } = await supabase
        .from("guests")
        .insert([
          {
            name: newGuest.name,
            phone: newGuest.phone || null,
            email: newGuest.email || null,
            event_type: newGuest.eventType,
            invitation_slug: slug,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: `Guest ${newGuest.name} berhasil ditambahkan!`,
      });

      setNewGuest({ name: "", phone: "", email: "", eventType: "wedding" });
      setShowAddGuestModal(false);
      fetchData();
    } catch (error: any) {
      console.error("Error adding guest:", error);
      toast({
        title: "Gagal menambahkan guest",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // HANDLE DELETE GUEST
  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Hapus guest "${name}"?`)) return;

    try {
      const { error } = await supabase.from("guests").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Guest dihapus",
        description: `${name} telah dihapus dari database.`,
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Gagal menghapus guest",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // HANDLE COPY LINK
  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast({
      title: "Link disalin!",
      description: "Link undangan berhasil disalin ke clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // HANDLE LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // HANDLE DELETE WISH
  const handleDeleteWish = async (id: string) => {
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (!error) {
      setWishes(wishes.filter((w) => w.id !== id));
      toast({ title: "Ucapan dihapus" });
    }
  };

  // HANDLE QR SCAN
  const handleQRScan = (decodedText: string) => {
    // Extract RSVP ID from QR code
    let rsvpId = decodedText.trim();

    if (rsvpId.includes("/check-in/")) {
      const parts = rsvpId.split("/check-in/");
      rsvpId = parts[parts.length - 1];
    }

    setShowScanner(false);
    router.push(`/admin/check-in/${rsvpId}`);
  };

  // STATS
  const totalGuests = rsvps.reduce(
    (acc, curr) => acc + (curr.attending ? curr.guest_count : 0),
    0,
  );
  const confirmedGuests = rsvps.filter((r) => r.attending).length;
  const checkedInGuests = rsvps.filter((r) => r.checked_in).length;

  // FILTER SEARCH
  const filteredRsvps = rsvps.filter((r) =>
    r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Guest Management & Event Overview</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowScanner(true)}
            className="flex gap-2"
          >
            <Camera className="w-4 h-4" /> Scanner
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Guests
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.length}</div>
            <p className="text-xs text-gray-500">Database tamu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pax
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
            <p className="text-xs text-gray-500">Orang akan hadir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              RSVP Confirmed
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedGuests}</div>
            <p className="text-xs text-gray-500">Konfirmasi kehadiran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Check-In
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInGuests}</div>
            <p className="text-xs text-gray-500">Tamu sudah datang</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="guests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="guests">Guest List</TabsTrigger>
          <TabsTrigger value="rsvp">RSVP</TabsTrigger>
          <TabsTrigger value="wishes">Ucapan</TabsTrigger>
        </TabsList>

        {/* TAB GUESTS */}
        <TabsContent value="guests">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Guest Database</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Cari nama guest..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Dialog
                    open={showAddGuestModal}
                    onOpenChange={setShowAddGuestModal}
                  >
                    <DialogTrigger asChild>
                      <Button className="flex gap-2">
                        <UserPlus className="w-4 h-4" /> Add Guest
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Guest</DialogTitle>
                        <DialogDescription>
                          Tambahkan guest baru dan generate link undangan
                          otomatis
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddGuest} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Guest *</Label>
                          <Input
                            id="name"
                            value={newGuest.name}
                            onChange={(e) =>
                              setNewGuest({ ...newGuest, name: e.target.value })
                            }
                            placeholder="e.g., Balqis Cantik"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">No. WhatsApp</Label>
                          <Input
                            id="phone"
                            value={newGuest.phone}
                            onChange={(e) =>
                              setNewGuest({
                                ...newGuest,
                                phone: e.target.value,
                              })
                            }
                            placeholder="08123456789"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eventType">Event Type *</Label>
                          <Select
                            value={newGuest.eventType}
                            onValueChange={(value) =>
                              setNewGuest({ ...newGuest, eventType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lampung">
                                Lampung Akad
                              </SelectItem>
                              <SelectItem value="jakarta">
                                Jakarta Resepsi
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddGuestModal(false);
                              setNewGuest({
                                name: "",
                                phone: "",
                                email: "",
                                eventType: "wedding",
                              });
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="flex-1">
                            Add Guest
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Guest</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Link Undangan</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.map((guest, index) => {
                    const invitationLink = generateInvitationLink(
                      guest.name,
                      guest.event_type,
                    );
                    return (
                      <TableRow key={guest.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {guest.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {guest.event_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-xs">
                              {invitationLink}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleCopyLink(invitationLink, guest.id)
                              }
                              className="flex-shrink-0"
                            >
                              {copiedId === guest.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDeleteGuest(guest.id, guest.name)
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredGuests.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? "Guest tidak ditemukan"
                          : "Belum ada guest. Tambahkan guest pertama!"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB RSVP */}
        <TabsContent value="rsvp">
          <Card>
            <CardHeader>
              <CardTitle>Data Kehadiran (RSVP)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Tamu</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Check-In</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRsvps.map((rsvp) => (
                    <TableRow key={rsvp.id}>
                      <TableCell className="font-medium">
                        {rsvp.guest_name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {rsvp.event_type}
                      </TableCell>
                      <TableCell>
                        {rsvp.attending ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Hadir
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Tidak</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {rsvp.attending ? `${rsvp.guest_count} Pax` : "-"}
                      </TableCell>
                      <TableCell>
                        {rsvp.checked_in ? (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Sudah Masuk
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Belum</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRsvps.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        Belum ada RSVP
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB UCAPAN */}
        <TabsContent value="wishes">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Ucapan & Doa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wishes.map((wish) => (
                  <div
                    key={wish.id}
                    className="p-4 border rounded-lg bg-white flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-bold">{wish.name}</h4>
                      <p className="text-gray-600 mt-1">{wish.message}</p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {new Date(wish.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWish(wish.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                {wishes.length === 0 && (
                  <p className="text-center py-8 text-gray-500">
                    Belum ada ucapan
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
