import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  // 1. Cek Login (Cepat)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // 2. Langsung Tampilkan Dashboard (Tanpa ambil data berat di sini)
  // Kita serahkan tugas ambil data ke AdminDashboard di sisi client
  return <AdminDashboard />;
}
