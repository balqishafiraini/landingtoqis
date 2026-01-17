"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  MessageSquare,
  CheckCircle2,
  Search,
  LogOut,
  Loader2,
  Trash2,
  QrCode,
  ScanLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Definisikan tipe data
type Guest = {
  id: string;
  name: string;
  phone: string;
  event_type: string;
  invitation_slug: string;
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

type WishlistItem = {
  id: string;
  name: string;
  is_claimed: boolean;
  claimed_by: string | null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // STATE DATA
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // STATE LOADING & SEARCH
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // STATE QR SCANNER
  const [scanInput, setScanInput] = useState("");

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resGuests, resRsvp, resWishes, resWishlist] = await Promise.all([
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
          supabase
            .from("wishlist")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (resGuests.data) setGuests(resGuests.data);
        if (resRsvp.data) setRsvps(resRsvp.data);
        if (resWishes.data) setWishes(resWishes.data);
        if (resWishlist.data) setWishlist(resWishlist.data);
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

    fetchData();
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // Fungsi Hapus Ucapan
  const handleDeleteWish = async (id: string) => {
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (!error) {
      setWishes(wishes.filter((w) => w.id !== id));
      toast({ title: "Ucapan dihapus" });
    }
  };

  // Fungsi QR Scanner
  const handleScanSubmit = () => {
    if (scanInput.trim()) {
      let rsvpId = scanInput.trim();

      // Extract ID dari URL jika user paste full URL
      if (rsvpId.includes("/check-in/")) {
        const parts = rsvpId.split("/check-in/");
        rsvpId = parts[parts.length - 1];
      }

      router.push(`/admin/check-in/${rsvpId}`);
    }
  };

  // Hitung Statistik
  const totalGuests = rsvps.reduce(
    (acc, curr) => acc + (curr.attending ? curr.guest_count : 0),
    0
  );
  const confirmedGuests = rsvps.filter((r) => r.attending).length;
  const checkedInGuests = rsvps.filter((r) => r.checked_in).length;

  // Filter Search
  const filteredRsvps = rsvps.filter((r) =>
    r.guest_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Memuat Data Pernikahan...</p>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Overview Pernikahan Balqis & Erlan</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* QR SCANNER WIDGET */}
      <Card className="mb-6 border-2 border-primary/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ScanLine className="w-5 h-5 text-primary" />
            Quick Check-in Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Paste QR Code URL atau RSVP ID..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScanSubmit()}
              className="font-mono text-sm"
            />
            <Button
              onClick={handleScanSubmit}
              size="icon"
              disabled={!scanInput.trim()}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">💡 Tips:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Paste full URL dari QR Code atau copy RSVP ID</li>
              <li>Tekan Enter atau klik tombol cari untuk check-in</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Tamu (Pax)
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
              RSVP Masuk
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
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInGuests}</div>
            <p className="text-xs text-gray-500">Tamu sudah datang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ucapan
            </CardTitle>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishes.length}</div>
            <p className="text-xs text-gray-500">Pesan & Doa</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Menu */}
      <Tabs defaultValue="rsvp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rsvp">Daftar Hadir (RSVP)</TabsTrigger>
          <TabsTrigger value="wishes">Ucapan</TabsTrigger>
          <TabsTrigger value="wishlist">Hadiah</TabsTrigger>
          <TabsTrigger value="guests">Semua Tamu</TabsTrigger>
        </TabsList>

        {/* TAB RSVP */}
        <TabsContent value="rsvp">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Data Kehadiran</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Cari nama tamu..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Tamu</TableHead>
                    <TableHead>Acara</TableHead>
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
                        Tidak ada data ditemukan
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB HADIAH */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Status Kado Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pemberi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wishlist.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.is_claimed ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            Terambil
                          </Badge>
                        ) : (
                          <Badge variant="outline">Tersedia</Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.claimed_by || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB SEMUA TAMU */}
        <TabsContent value="guests">
          <Card>
            <CardHeader>
              <CardTitle>Database Tamu (Raw)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>No. HP</TableHead>
                    <TableHead>Slug Undangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>{g.name}</TableCell>
                      <TableCell>{g.phone}</TableCell>
                      <TableCell className="text-xs font-mono text-gray-500">
                        {g.invitation_slug}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
