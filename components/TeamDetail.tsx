import type { Team } from "@/lib/team-types";
import TeamInfoCard from "@/components/TeamInfoCard";
import TeamMembersList from "@/components/TeamMembersList";

const sectionCard =
  "rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]";
const sectionTitle = "text-[24px] font-bold text-[#2f5d9a]";

export default function TeamDetail({ team }: { team: Team }) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <section id="about" className={`${sectionCard} scroll-mt-6`}>
          <h2 className={sectionTitle}>Gambaran Ide</h2>
          {team.title && (
            <h3 className="mt-4 text-[20px] font-bold text-black">
              {team.title}
            </h3>
          )}
          <p className="mt-3 text-[17px] leading-relaxed text-[#333]">
            {team.ideaOverview || "Belum ada gambaran ide."}
          </p>
        </section>

        <section id="members" className={`${sectionCard} scroll-mt-6`}>
          <h2 className={sectionTitle}>Members</h2>
          <TeamMembersList teamId={team.id} />
        </section>
      </div>

      <div className="flex w-full flex-col gap-5 xl:w-[360px] xl:shrink-0">
        <TeamInfoCard team={team} />
      </div>
    </div>
  );
}
