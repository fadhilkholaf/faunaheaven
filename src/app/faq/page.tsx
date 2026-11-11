import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { FAQList } from "../../components/faq-list";
import { MainNav } from "../../components/main-nav";
export const dynamic = "force-dynamic";
export default async function FAQPage() {
    const items = await prisma.fAQ.findMany({
        orderBy: [{ category: "asc" }, { position: "asc" }],
    });
    return (
        <main className="min-h-screen bg-[#fffaf4] px-6 py-10 text-[#1e2925] lg:px-10">
            <MainNav />
            <section className="mx-auto max-w-3xl">
                <Link href="/" className="font-bold text-[#1f7a5c]">
                    ← FaunaHeaven
                </Link>
                <h1 className="mt-20 font-serif text-5xl text-[#18352a]">
                    Semua pertanyaan, terjawab.
                </h1>
                <p className="mt-4 mb-10 text-lg text-[#708078]">
                    Semua yang perlu kamu ketahui ada di sini.
                </p>
                <FAQList items={items} />
            </section>
        </main>
    );
}
