import type { Metadata } from "next";
import AdminUsersView from "@/components/AdminUsersView";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Kelola Pengguna — OKFT-UH",
  description: "Kelola akun pengguna (khusus admin).",
};

export default async function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-5">
        <div className="sticky top-5 hidden h-[calc(100vh-40px)] lg:block">
          <Sidebar active="db" />
        </div>
        <main className="min-w-0 flex-1 pb-28 lg:pb-16">
          <AdminUsersView />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
