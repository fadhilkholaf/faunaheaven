import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/server-auth";
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return (
        <main className="min-h-screen bg-[#fffaf4] text-[#1e2925]">
            <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8 lg:px-10">
                <aside className="hidden w-52 shrink-0 md:block">
                    <Link href="/" className="font-bold text-[#1f7a5c]">
                        ← FaunaHeaven
                    </Link>
                    <nav className="mt-12 space-y-2 text-sm font-semibold text-[#52605a]">
                        <Link
                            className="block rounded-xl px-3 py-2 hover:bg-[#e3f2e8]"
                            href="/admin"
                        >
                            Ringkasan
                        </Link>
                        {[
                            ["users", "Pengguna"],
                            ["courses", "Kursus"],
                            ["journal", "Jurnal"],
                            ["ecokuji", "EcoKuji"],
                            ["faunadex", "FaunaDex"],
                            ["missions", "Misi"],
                            ["promos", "Kode promo"],
                            ["faqs", "FAQ"],
                        ].map(([slug, label]) => (
                            <Link
                                key={slug}
                                className="block rounded-xl px-3 py-2 hover:bg-[#e3f2e8]"
                                href={`/admin/${slug}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <div className="min-w-0 flex-1">{children}</div>
            </div>
        </main>
    );
}
