import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import NotificationsView from "@/components/NotificationsView";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Notifikasi — OKFT-UH",
  description: "Permintaan bergabung dan status permohonan tim.",
};

export default async function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-5">
        <div className="sticky top-5 hidden h-[calc(100vh-40px)] lg:block">
          <Sidebar active="notifikasi" />
        </div>
        <main className="min-w-0 flex-1 pb-28 lg:pb-16">
          <NotificationsView />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
