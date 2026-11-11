import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../../lib/server-auth";
import { GachaControls } from "../../components/gacha-controls";
import { MainNav } from "../../components/main-nav";
import { GachaChanceDialog } from "../../components/gacha-chance-dialog";
export default async function EcoKujiPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    const [banners] = await Promise.all([
        prisma.gachaBanner.findMany({
            where: { active: true },
            include: {
                prizes: {
                    include: { faunaEntry: true },
                    orderBy: { rarity: "asc" },
                },
            },
        }),
    ]);
    return (
        <main className="min-h-screen bg-[#fffaf4] text-[#1e2925]">
            <MainNav userName={user.name} />
            <section className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
                <Link href="/" className="font-bold text-[#1f7a5c]">
                    ← FaunaHeaven
                </Link>
                <div className="mt-16 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-[#e87552] uppercase">
                            Kumpulkan sedikit keajaiban
                        </p>
                        <h1 className="mt-2 font-serif text-5xl text-[#18352a]">
                            EcoKuji
                        </h1>
                    </div>
                </div>
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {banners.map((banner) => (
                        <article
                            key={banner.id}
                            className="overflow-hidden rounded-[28px] border border-[#e5ece6] bg-white"
                        >
                            <GachaChanceDialog title={banner.title} imageUrl={banner.imageUrl} prizes={banner.prizes} />
                            <div className="p-6">
                                <p className="text-xs font-bold tracking-wider text-[#1f7a5c] uppercase">
                                    {banner.category}
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#244337]">
                                    {banner.title}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#708078]">
                                    {banner.description}
                                </p>
                                <p className="mt-4 text-xs font-semibold text-[#87948c]">
                                    {banner.prizes.reduce(
                                        (sum, prize) => sum + prize.stock,
                                        0,
                                    )}{" "}
                                    hadiah tersisa
                                </p>
                                <div className="mt-5">
                                    <GachaControls
                                        bannerId={banner.id}
                                        spinCost={banner.spinCost}
                                        tenSpinCost={banner.tenSpinCost}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
