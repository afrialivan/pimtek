import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import TeamsView from "@/components/TeamsView";

export const metadata: Metadata = {
  title: "Tim Saya — OKFT-UH",
  description: "Daftar tim PIMTEK OKFT-UH yang Anda ikuti.",
};

export default async function TeamsPage() {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-5">
        <div className="sticky top-5 hidden h-[calc(100vh-40px)] lg:block">
          <Sidebar active="teams" />
        </div>
        <main className="min-w-0 flex-1 pb-28 lg:pb-16">
          <TeamsView />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
