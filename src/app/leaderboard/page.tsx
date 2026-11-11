import Link from "next/link";
import { Trophy } from "lucide-react";
import { MainNav } from "../../components/main-nav";
import { getCurrentUser } from "../../lib/server-auth";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

type Leader = {
    userId: string;
    name: string;
    totalCards: number;
    uniqueSpecies: number;
};

function Ranking({ title, subtitle, items, value }: { title: string; subtitle: string; items: Leader[]; value: "cards" | "species" }) {
    return <section className="rounded-[28px] border border-[#e5ece6] bg-white p-6 dark:border-[#29483b] dark:bg-[#172d25]">
        <h2 className="font-serif text-3xl text-[#18352a] dark:text-[#e7f1eb]">{title}</h2>
        <p className="mt-2 text-sm text-[#708078] dark:text-[#b4c8bd]">{subtitle}</p>
        <ol className="mt-6 space-y-3">
            {items.slice(0, 10).map((leader, index) => <li key={leader.userId} className="flex items-center gap-3 rounded-2xl border border-[#edf1ed] px-4 py-3 dark:border-[#29483b]"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e3f2e8] text-sm font-bold text-[#1f7a5c] dark:bg-[#1d3d30]">{index + 1}</span><span className="min-w-0 flex-1 truncate font-bold text-[#244337] dark:text-[#e7f1eb]">{leader.name}</span><span className="text-right text-sm font-bold text-[#e87552]">{value === "cards" ? `${leader.totalCards} kartu` : `${leader.uniqueSpecies} spesies`}</span></li>)}
        </ol>
        {!items.length && <p className="mt-6 rounded-xl bg-[#fffaf4] p-4 text-sm text-[#708078] dark:bg-[#12251e] dark:text-[#b4c8bd]">Belum ada koleksi yang tercatat.</p>}
    </section>;
}

export default async function LeaderboardPage() {
    const user = await getCurrentUser();
    const collections = await prisma.userCollection.findMany({
        where: { quantity: { gt: 0 } },
        select: {
            userId: true,
            quantity: true,
            user: { select: { name: true, profile: { select: { displayName: true } } } },
        },
    });
    const leaders = Array.from(
        collections.reduce((map, collection) => {
            const current = map.get(collection.userId) ?? {
                userId: collection.userId,
                name: collection.user.profile?.displayName || collection.user.name,
                totalCards: 0,
                uniqueSpecies: 0,
            };
            current.totalCards += collection.quantity;
            current.uniqueSpecies += 1;
            map.set(collection.userId, current);
            return map;
        }, new Map<string, Leader>()).values(),
    );
    const byCards = [...leaders].sort((a, b) => b.totalCards - a.totalCards || b.uniqueSpecies - a.uniqueSpecies);
    const bySpecies = [...leaders].sort((a, b) => b.uniqueSpecies - a.uniqueSpecies || b.totalCards - a.totalCards);

    return <main className="min-h-screen bg-[#fffaf4] text-[#1e2925] dark:bg-[#0f211b] dark:text-[#e7f1eb]"><MainNav userName={user?.name} /><section className="mx-auto max-w-6xl px-6 py-10 lg:px-10"><Link href="/" className="font-bold text-[#1f7a5c]">← FaunaHeaven</Link><div className="mt-16 flex items-end gap-4"><span className="flex size-14 items-center justify-center rounded-2xl bg-[#fff3ce] text-[#c99424]"><Trophy size={30} /></span><div><p className="text-xs font-bold uppercase tracking-wider text-[#e87552]">Kompetisi koleksi</p><h1 className="mt-2 font-serif text-5xl text-[#18352a] dark:text-[#e7f1eb]">Papan peringkat</h1></div></div><p className="mt-6 max-w-2xl text-lg leading-8 text-[#708078] dark:text-[#b4c8bd]">Lihat siapa yang mengumpulkan kartu terbanyak dan siapa yang menemukan spesies paling lengkap.</p><div className="mt-10 grid gap-6 lg:grid-cols-2"><Ranking title="Koleksi terbanyak" subtitle="Jumlah seluruh kartu, termasuk duplikat." items={byCards} value="cards" /><Ranking title="Koleksi terlengkap" subtitle="Jumlah spesies unik yang sudah ditemukan." items={bySpecies} value="species" /></div></section></main>;
}
