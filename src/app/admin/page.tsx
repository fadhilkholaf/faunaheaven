import Link from "next/link";
export default function AdminPage() {
    return (
        <section>
            <p className="text-xs font-bold tracking-wider text-[#e87552] uppercase">
                Ruang kerja admin
            </p>
            <h1 className="mt-2 font-serif text-5xl text-[#18352a]">
                Pusat kendali FaunaHeaven
            </h1>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
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
                        href={`/admin/${slug}`}
                        className="rounded-2xl border border-[#e5ece6] bg-white p-6 font-bold text-[#244337] hover:border-[#9db9aa]"
                    >
                        {label}
                        <span className="mt-2 block text-sm font-normal text-[#708078]">
                            Kelola data →
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
