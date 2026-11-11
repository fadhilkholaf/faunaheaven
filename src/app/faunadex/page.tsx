import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../../lib/server-auth";
import { ConvertDuplicate } from "../../components/convert-duplicate";
import { MainNav } from "../../components/main-nav";
import { FaunaDetailDialog } from "../../components/fauna-detail-dialog";

export default async function FaunaDexPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    const [entries, wallet] = await Promise.all([
        prisma.faunaEntry.findMany({
            orderBy: { createdAt: "asc" },
            include: { collections: { where: { userId: user.id } } },
        }),
        prisma.wallet.findUnique({ where: { userId: user.id } }),
    ]);
    const unlocked = entries.filter(
        (entry) => entry.collections[0]?.quantity,
    ).length;
    return (
        <main className="min-h-screen bg-[#fffaf4] text-[#1e2925]">
            <MainNav userName={user.name} />
            <section className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
                <Link href="/" className="font-bold text-[#1f7a5c]">
                    ← FaunaHeaven
                </Link>
                <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-[#e87552] uppercase">
                            Koleksi kehidupanmu
                        </p>
                        <h1 className="mt-2 font-serif text-5xl text-[#18352a]">
                            FaunaDex
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-[#1f7a5c]">
                            {unlocked}/{entries.length} ditemukan
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#9b741d]">
                            {wallet?.coins ?? 0} koin tersedia
                        </p>
                    </div>
                </div>
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {entries.map((entry) => {
                        const quantity = entry.collections[0]?.quantity ?? 0;
                        return (
                            <article
                                key={entry.id}
                                className={`overflow-hidden rounded-[24px] border border-[#e5ece6] bg-white ${!quantity ? "opacity-55 grayscale" : ""}`}
                            >
                                <img
                                    src={entry.imageUrl}
                                    alt={entry.name}
                                    className="aspect-square w-full object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="font-bold text-[#244337]">
                                            {entry.name}
                                        </h2>
                                        <span className="text-[10px] font-bold text-[#e87552] uppercase">
                                            {entry.rarity.toLowerCase()}
                                        </span>
                                    </div>
                                    <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#708078]" title={entry.description}>
                                        {entry.description}
                                    </p>
                                    <p className="mt-2 text-[11px] font-semibold text-[#87948c]">
                                        {entry.habitat} · {entry.scientificName}
                                    </p>
                                    <p className="mt-2 text-xs font-bold text-[#1f7a5c]">
                                        {quantity
                                            ? `x${quantity} terkumpul`
                                            : "Terkunci"}
                                    </p>
                                    {quantity > 1 && (
                                        <ConvertDuplicate
                                            faunaEntryId={entry.id}
                                        />
                                    )}
                                    <FaunaDetailDialog entry={entry} quantity={quantity} />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
