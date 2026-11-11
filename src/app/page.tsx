import { ArrowRight, Heart, PawPrint, Sparkles } from "lucide-react";
import Link from "next/link";
import { CourseCatalog } from "../components/course-catalog";
import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/server-auth";
import { MainNav } from "../components/main-nav";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const courses = await prisma.course.findMany({
        include: { category: true },
        orderBy: { createdAt: "asc" },
    });
    const user = await getCurrentUser();
    const wallet = user
        ? await prisma.wallet.findUnique({
              where: { userId: user.id },
              select: { coins: true },
          })
        : null;
    return (
        <main className="min-h-screen overflow-hidden bg-[#fffaf4] text-[#1e2925]">
            <MainNav userName={user?.name} coins={wallet?.coins} />
            <section
                id="top"
                className="mx-auto grid max-w-7xl items-center gap-12 px-6 pt-10 pb-20 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:pt-20 lg:pb-24"
            >
                <div className="max-w-xl">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9e7de] bg-white px-3.5 py-2 text-xs font-bold tracking-[0.14em] text-[#1f7a5c] uppercase">
                        <Sparkles size={14} /> Awal yang lebih baik, bersama
                    </div>
                    <h1 className="font-serif text-[clamp(3.7rem,7vw,6.6rem)] leading-[.94] font-medium tracking-[-0.055em] text-[#18352a]">
                        Pelajari alam.{" "}
                        <span className="text-[#e87552] italic">Cintai alam</span>{" "}
                        lebih dalam.
                    </h1>
                    <p className="mt-8 max-w-lg text-lg leading-8 text-[#5c6b64]">
                        Bangun hubungan yang lebih dekat dengan dunia kehidupan melalui kursus konservasi singkat dan catatan lapangan yang indah.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                        <a
                            href="#catalog"
                            className="group inline-flex items-center gap-3 rounded-full bg-[#e87552] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#e87552]/20"
                        >
                            Jelajahi kursus{" "}
                            <ArrowRight
                                size={17}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </a>
                        <Link
                            href="/journal"
                            className="inline-flex items-center gap-2 rounded-full border border-[#d8e2dc] bg-white px-6 py-3.5 text-sm font-bold text-[#2c4138]"
                        >
                            Baca jurnal
                        </Link>
                    </div>
                    <p className="mt-9 flex items-center gap-2 text-sm text-[#6c7b72]">
                        <Heart
                            size={16}
                            className="text-[#e87552]"
                            fill="currentColor"
                        />{" "}
                        Bergabunglah dengan 12.000+ orang yang belajar bersama
                    </p>
                </div>
                <div className="relative mx-auto h-[470px] w-full max-w-[550px] lg:h-[570px]">
                    <div className="absolute inset-x-5 top-3 bottom-0 rotate-3 rounded-[45%_45%_24%_24%] bg-[#e8f0e8]" />
                    <div className="absolute inset-x-0 top-0 bottom-5 overflow-hidden rounded-[35%_45%_24%_24%] bg-[#f3c3a7]">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/64/Cendrawasih.jpg"
                            alt="Burung cendrawasih"
                            className="h-full w-full object-cover object-top opacity-90 mix-blend-multiply -scale-x-100"
                        />
                    </div>
                    <div className="absolute top-60 -left-10 rounded-2xl bg-white px-4 py-3 shadow-xl">
                        <p className="text-xs font-bold text-[#203d31]">
                            Dunia yang layak dikenal
                        </p>
                        <p className="mt-1 text-[11px] text-[#75817b]">
                            Satu pelajaran setiap langkah
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-10 rounded-2xl bg-[#1f7a5c] px-5 py-4 text-white shadow-xl">
                        <p className="text-sm font-bold">
                            Belajar. Jelajah. Lindungi.
                        </p>
                        <p className="mt-1 text-xs text-[#cae5d6]">
                            Rasa ingin tahumu berarti
                        </p>
                    </div>
                </div>
            </section>
            <CourseCatalog courses={courses} />
            <section className="border-y border-[#e9eee9] bg-white/65 px-6 py-20 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
                    <div className="rounded-[28px] bg-[#e3f2e8] p-7">
                        <PawPrint className="mb-6 text-[#1f7a5c]" />
                        <h2 className="text-xl font-bold text-[#244337]">
                            Belajar sesuai ritmemu
                        </h2>
                        <p className="mt-3 leading-7 text-[#708078]">
                            Modul singkat dan bermakna untuk kehidupan nyata dan pikiran yang ingin tahu.
                        </p>
                    </div>
                    <div className="rounded-[28px] bg-[#fff0e9] p-7">
                        <Heart className="mb-6 text-[#e87552]" />
                        <h2 className="text-xl font-bold text-[#244337]">
                            Ubah pengetahuan menjadi kepedulian
                        </h2>
                        <p className="mt-3 leading-7 text-[#708078]">
                            Setiap pelajaran memberi cara yang lebih jelas untuk menjaga planet ini.
                        </p>
                    </div>
                    <div className="rounded-[28px] bg-[#fff3ce] p-7">
                        <Sparkles className="mb-6 text-[#c99424]" />
                        <h2 className="text-xl font-bold text-[#244337]">
                            Dapatkan hadiah sambil belajar
                        </h2>
                        <p className="mt-3 leading-7 text-[#708078]">
                            Selesaikan kursus dan kuis untuk menambah saldo koin FaunaHeaven.
                        </p>
                    </div>
                </div>
            </section>
            <footer className="px-6 py-10 lg:px-10">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#7a8980] sm:flex-row">
                    <span className="font-bold text-[#244337]">
                        FaunaHeaven
                    </span>
                    <span>Dibuat dengan kepedulian untuk semua kehidupan.</span>
                    <span>© 2026 FaunaHeaven</span>
                </div>
            </footer>
        </main>
    );
}
