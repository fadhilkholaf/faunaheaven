import Link from "next/link";
import { Gift } from "lucide-react";
import { MainNav } from "../../components/main-nav";
import { PromoForm } from "../../components/promo-form";
import { getCurrentUser } from "../../lib/server-auth";

export default async function PromoPage() {
    const user = await getCurrentUser();
    if (!user) return <main className="flex min-h-screen items-center justify-center bg-[#fffaf4] px-6"><section className="rounded-[28px] border border-[#e5ece6] bg-white p-8 text-center"><h1 className="font-serif text-3xl text-[#18352a]">Masuk untuk menukar kode</h1><Link href="/login" className="mt-6 inline-flex rounded-full bg-[#1f7a5c] px-5 py-3 text-sm font-bold text-white">Masuk</Link></section></main>;
    return <main className="min-h-screen bg-[#fffaf4] text-[#1e2925] dark:bg-[#0f211b] dark:text-[#e7f1eb]"><MainNav userName={user.name} /><section className="mx-auto max-w-3xl px-6 py-10 lg:px-10"><Link href="/" className="font-bold text-[#1f7a5c]">← FaunaHeaven</Link><div className="mt-16 rounded-[30px] border border-[#e5ece6] bg-white p-8 shadow-sm dark:border-[#29483b] dark:bg-[#172d25] sm:p-12"><div className="flex size-14 items-center justify-center rounded-2xl bg-[#fff3ce] text-[#c99424]"><Gift size={28} /></div><p className="mt-8 text-xs font-bold uppercase tracking-wider text-[#e87552]">Hadiah komunitas</p><h1 className="mt-2 font-serif text-5xl text-[#18352a] dark:text-[#e7f1eb]">Tukar kode promo</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#708078] dark:text-[#b4c8bd]">Masukkan kode yang kamu miliki untuk mendapatkan koin ke dompet FaunaHeaven-mu.</p><div className="mt-8"><PromoForm /></div><p className="mt-6 text-xs text-[#87948c]">Setiap kode hanya dapat digunakan sesuai aturan dan masa berlaku yang ditentukan.</p></div></section></main>;
}
