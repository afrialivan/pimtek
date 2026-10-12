import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import ExploreTeamsView from "@/components/ExploreTeamsView";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Explore Tim — OKFT-UH",
  description: "Jelajahi tim PIMTEK OKFT-UH yang sudah ada dan bergabung.",
};

export default async function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-5">
        <div className="sticky top-5 hidden h-[calc(100vh-40px)] lg:block">
          <Sidebar active="explore" />
        </div>
        <main className="min-w-0 flex-1 pb-28 lg:pb-16">
          <ExploreTeamsView />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
