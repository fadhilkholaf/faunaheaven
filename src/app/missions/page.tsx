import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../../lib/server-auth";
import { MissionClaim } from "../../components/mission-claim";
import { MainNav } from "../../components/main-nav";
export default async function MissionsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const missions = await prisma.dailyMission.findMany({
        where: { active: true },
        include: {
            progress: { where: { userId: user.id, missionDate: today } },
        },
    });
    return (
        <main className="min-h-screen bg-[#fffaf4] px-6 py-10 text-[#1e2925] lg:px-10">
            <MainNav userName={user.name} />
            <section className="mx-auto max-w-4xl">
                <Link href="/" className="font-bold text-[#1f7a5c]">
                    ← FaunaHeaven
                </Link>
                <h1 className="mt-16 font-serif text-5xl text-[#18352a]">
                    Misi harian
                </h1>
                <p className="mt-4 text-lg text-[#708078]">
                    Tindakan kecil, kemajuan bermakna.
                </p>
                <div className="mt-10 grid gap-4">
                    {missions.map((mission) => {
                        const progress = mission.progress[0]?.progress ?? 0;
                        const claimed = Boolean(mission.progress[0]?.claimedAt);
                        return (
                            <article
                                key={mission.id}
                                className="rounded-[24px] border border-[#e5ece6] bg-white p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="font-bold text-[#244337]">
                                            {mission.title}
                                        </h2>
                                        <p className="mt-2 text-sm text-[#708078]">
                                            {mission.description}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-[#fff3ce] px-3 py-1 text-xs font-bold text-[#a87918]">
                                        +{mission.rewardCoins}
                                    </span>
                                </div>
                                <div className="mt-5 h-2 rounded-full bg-[#e8f0e8]">
                                    <div
                                        className="h-full rounded-full bg-[#1f7a5c]"
                                        style={{
                                            width: `${Math.min(100, (progress / mission.target) * 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#7c8981]">
                                    <span>
                                        {progress}/{mission.target}
                                    </span>
                                    {claimed ? (
                                        <span className="text-[#1f7a5c]">
                                            Diklaim
                                        </span>
                                    ) : (
                                        <MissionClaim
                                            missionId={mission.id}
                                            ready={progress >= mission.target}
                                        />
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
