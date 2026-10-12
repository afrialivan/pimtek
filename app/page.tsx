import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import ProfileCard from "@/components/ProfileCard";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard — OKFT-UH",
  description: "Profil dan dashboard peneliti OKFT-UH PIMTEK.",
};

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-5">
        <div className="sticky top-5 hidden h-[calc(100vh-40px)] lg:block">
          <Sidebar active="dashboard" />
        </div>
        <main className="min-w-0 flex-1 pb-28 lg:pb-16">
          <ProfileCard />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
