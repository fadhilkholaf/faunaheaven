import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Coins } from "lucide-react";
import { prisma } from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/server-auth";
import { ModuleComplete } from "../../../components/module-complete";
import { MainNav } from "../../../components/main-nav";

export const dynamic = "force-dynamic";

export default async function LearnPage({
    params,
    searchParams,
}: {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ module?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    const { courseId } = await params;
    const { module: selectedModuleId } = await searchParams;
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: { orderBy: { position: "asc" } },
            progress: { where: { userId: user.id } },
        },
    });
    if (!course) notFound();
    const [enrollment, wallet] = await Promise.all([
        prisma.courseEnrollment.findUnique({
            where: { userId_courseId: { userId: user.id, courseId } },
        }),
        prisma.wallet.findUnique({ where: { userId: user.id } }),
    ]);
    if (!enrollment) redirect(`/courses/${course.slug}`);
    const completed = new Set(course.progress.map((item) => item.moduleId));
    const current =
        course.modules.find((module) => module.id === selectedModuleId) ??
        course.modules.find((module) => !completed.has(module.id)) ??
        course.modules[course.modules.length - 1];
    const currentIndex = course.modules.findIndex(
        (module) => module.id === current.id,
    );
    const previous = course.modules[currentIndex - 1];
    const next = course.modules[currentIndex + 1];
    const percent = Math.round((completed.size / course.modules.length) * 100);
    return (
        <main className="min-h-screen bg-[#fffaf4] text-[#1e2925]">
            <MainNav userName={user.name} />
            <header className="border-b border-[#e5ece6] bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
                    <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#1f7a5c]"
                    >
                        <ArrowLeft size={16} /> {course.title}
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 rounded-full bg-[#fff3ce] px-3 py-2 text-sm font-bold text-[#9b741d]">
                            <Coins size={15} /> {wallet?.coins ?? 0}
                        </span>
                        <span className="text-sm font-bold text-[#708078]">
                            {percent}% selesai
                        </span>
                    </div>
                </div>
                <div className="h-1 bg-[#e8f0e8]">
                    <div
                        className="h-full bg-[#1f7a5c] transition-all"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </header>
            <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
                <aside className="rounded-[24px] border border-[#e5ece6] bg-white p-5">
                    <p className="mb-4 text-xs font-bold tracking-wider text-[#e87552] uppercase">
                        Modul kursus
                    </p>
                    <ol className="space-y-2">
                        {course.modules.map((module) => (
                            <li key={module.id}>
                                <Link
                                    href={`/learn/${course.id}?module=${module.id}`}
                                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-[#e3f2e8] ${current.id === module.id ? "bg-[#e3f2e8] font-bold text-[#1f7a5c]" : "text-[#708078]"}`}
                                >
                                    <span>
                                        {completed.has(module.id) ? (
                                            <CheckCircle2 size={17} />
                                        ) : (
                                            module.position
                                        )}
                                    </span>
                                    {module.title}
                                </Link>
                            </li>
                        ))}
                    </ol>
                </aside>
                <article className="rounded-[30px] border border-[#e5ece6] bg-white p-7 sm:p-10">
                    <p className="text-xs font-bold tracking-[0.16em] text-[#e87552] uppercase">
                        Modul {current.position} · {current.durationMin}{" "}
                        menit
                    </p>
                    <h1 className="mt-4 font-serif text-4xl text-[#18352a] sm:text-5xl">
                        {current.title}
                    </h1>
                    <p className="mt-5 text-lg leading-8 text-[#687870]">
                        {current.summary}
                    </p>
                    <div className="prose prose-stone mt-10 max-w-none text-[#52635a]">
                        <p>{current.content}</p>
                        <p>
                            Saat belajar, simpan satu pertanyaan: seperti apa cara memberi lebih banyak ruang bagi kehidupan ini di sekitarmu?
                        </p>
                    </div>
                    <ModuleComplete
                        key={current.id}
                        courseId={course.id}
                        moduleId={current.id}
                        complete={completed.has(current.id)}
                        final={current.position === course.modules.length}
                    />
                    <div className="mt-10 flex items-center justify-between border-t border-[#edf1ed] pt-6">
                        <div>
                            {previous && (
                                <Link
                                    href={`/learn/${course.id}?module=${previous.id}`}
                                    className="text-sm font-bold text-[#708078] hover:text-[#1f7a5c]"
                                >
                                    ← Sebelumnya
                                </Link>
                            )}
                        </div>
                        <div>
                            {next && (
                                <Link
                                    href={`/learn/${course.id}?module=${next.id}`}
                                    className="rounded-full bg-[#1f7a5c] px-5 py-3 text-sm font-bold text-white"
                                >
                                    Modul berikutnya →
                                </Link>
                            )}
                        </div>
                    </div>
                </article>
            </section>
        </main>
    );
}
