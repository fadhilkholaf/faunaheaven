import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { MainNav } from "../../components/main-nav";
export const dynamic = "force-dynamic";
export default async function JournalPage() {
    const categoryLabels: Record<string, string> = {
        wildlife: "Satwa liar",
        conservation: "Konservasi",
        climate: "Iklim",
        community: "Komunitas",
    };
    const journals = await prisma.journal.findMany({
        orderBy: { createdAt: "desc" },
    });
    return (
        <main className="min-h-screen bg-[#fffaf4] px-6 py-10 text-[#1e2925] lg:px-10">
            <MainNav />
            <header className="mx-auto max-w-6xl">
                <Link href="/" className="font-bold text-[#1f7a5c]">
                    ← FaunaHeaven
                </Link>
                <p className="mt-20 text-xs font-bold tracking-[0.16em] text-[#e87552] uppercase">
                    Jurnal FaunaHeaven
                </p>
                <h1 className="mt-3 max-w-2xl font-serif text-5xl text-[#18352a]">
                    Catatan lapangan untuk dunia yang lebih ingin tahu.
                </h1>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {journals.map((journal) => (
                        <Link
                            key={journal.id}
                            href={`/journal/${journal.slug}`}
                            className="group overflow-hidden rounded-[26px] border border-[#e5ece6] bg-white"
                        >
                            <img
                                src={journal.imageUrl}
                                alt={journal.title}
                                className="aspect-[1.4] w-full object-cover transition group-hover:scale-105"
                            />
                            <div className="p-6">
                                <p className="text-xs font-bold tracking-wider text-[#1f7a5c] uppercase">
                                    {categoryLabels[journal.category.toLowerCase()] ?? journal.category}
                                </p>
                                <h2 className="mt-2 text-xl font-bold text-[#244337]">
                                    {journal.title}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-[#75847b]">
                                    {journal.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </header>
        </main>
    );
}
