import type { Metadata } from "next";
import TeamDetailView from "@/components/TeamDetailView";

interface DetailParams {
  id: string;
}

export const metadata: Metadata = {
  title: "Detail Tim — Tim Saya | OKFT-UH",
  description: "Detail tim PIMTEK OKFT-UH: tentang tim dan anggota.",
};

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<DetailParams>;
}) {
  const { id } = await params;
  return <TeamDetailView id={id} />;
}
