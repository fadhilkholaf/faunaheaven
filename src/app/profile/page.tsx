import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../../lib/server-auth";
import { ProfileForm } from "../../components/profile-form";
import { DailyReward } from "../../components/daily-reward";
import { CoinTransactionType } from "../../../generated/prisma/enums";
import { dailyRewardReference } from "../../lib/gamification";
import { MainNav } from "../../components/main-nav";
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    const dailyRewardRef = dailyRewardReference();
    const [profile, wallet, enrollments, dailyReward] = await Promise.all([
        prisma.userProfile.findUnique({ where: { userId: user.id } }),
        prisma.wallet.findUnique({ where: { userId: user.id } }),
        prisma.courseEnrollment.findMany({
            where: { userId: user.id },
            include: { course: true },
        }),
        prisma.coinTransaction.findUnique({
            where: {
                userId_type_referenceId: {
                    userId: user.id,
                    type: CoinTransactionType.DAILY_REWARD,
                    referenceId: dailyRewardRef,
                },
            },
            select: { id: true },
        }),
    ]);
    return (
        <main className="min-h-screen bg-[#fffaf4] px-6 py-10 text-[#1e2925] lg:px-10">
            <MainNav userName={user.name} />
            <section className="mx-auto max-w-5xl">
                <Link href="/" className="font-bold text-[#1f7a5c]">
                    ← FaunaHeaven
                </Link>
                <div className="mt-16 rounded-[30px] bg-[#1f7a5c] p-8 text-white sm:p-12">
                    <p className="text-sm text-[#c5e1d2]">
                        Profil FaunaHeaven-mu
                    </p>
                    <h1 className="mt-2 font-serif text-5xl">
                        {profile?.displayName ?? user.name}
                    </h1>
                    <p className="mt-4 max-w-xl text-[#d8eee1]">
                        {profile?.bio ||
                            "Terus belajar, terus memperhatikan, terus memberi ruang."}
                    </p>
                    <div className="mt-8 flex gap-10">
                        <div>
                            <strong className="block text-3xl">
                                {wallet?.coins ?? 0}
                            </strong>
                            <span className="text-sm text-[#c5e1d2]">
                                koin
                            </span>
                        </div>
                        <div>
                            <strong className="block text-3xl">
                                {enrollments.length}
                            </strong>
                            <span className="text-sm text-[#c5e1d2]">
                                courses
                            </span>
                        </div>
                    </div>
                </div>
                <DailyReward claimed={Boolean(dailyReward)} />
                <h2 className="mt-12 font-serif text-3xl text-[#18352a]">
                    Jalur belajarmu
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {enrollments.length ? (
                        enrollments.map(({ course }) => (
                            <Link
                                key={course.id}
                                href={`/learn/${course.id}`}
                                className="rounded-2xl border border-[#e5ece6] bg-white p-5 font-bold text-[#244337] hover:border-[#9db9aa]"
                            >
                                {course.title}
                                <span className="mt-2 block text-sm font-normal text-[#708078]">
                                    Lanjut belajar →
                                </span>
                            </Link>
                        ))
                    ) : (
                        <p className="text-[#708078]">
                            Kamu belum mengikuti kursus apa pun.{" "}
                            <Link
                                href="/#catalog"
                                className="font-bold text-[#1f7a5c]"
                            >
                                Jelajahi katalog.
                            </Link>
                        </p>
                    )}
                </div>
                <ProfileForm
                    displayName={profile?.displayName ?? user.name}
                    bio={profile?.bio ?? ""}
                />
            </section>
        </main>
    );
}
