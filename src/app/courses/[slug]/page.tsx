import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock3, Star } from "lucide-react";
import { prisma } from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/server-auth";
import { EnrollButton } from "../../../components/enroll-button";
import { MainNav } from "../../../components/main-nav";
export const dynamic = "force-dynamic";
export default async function CoursePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await prisma.course.findFirst({
        where: { OR: [{ slug }, { id: slug }] },
        include: { category: true, modules: { orderBy: { position: "asc" } } },
    });
    if (!course) notFound();
    const user = await getCurrentUser();
    const enrollment = user
        ? await prisma.courseEnrollment.findUnique({
              where: {
                  userId_courseId: { userId: user.id, courseId: course.id },
              },
          })
        : null;
    return (
        <main className="min-h-screen bg-[#fffaf4] text-[#1e2925]">
            <MainNav userName={user?.name} />
            <header className="mx-auto max-w-5xl px-6 py-8">
                <Link
                    href="/#catalog"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#1f7a5c]"
                >
                    <ArrowLeft size={16} /> Semua kursus
                </Link>
            </header>
            <section className="mx-auto grid max-w-5xl gap-10 px-6 pb-20 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
                <div>
                    <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="aspect-[1.5] w-full rounded-[30px] object-cover"
                    />
                    <p className="mt-8 text-xs font-bold tracking-[0.15em] text-[#e87552] uppercase">
                        {course.provider} · {course.category.name}
                    </p>
                    <h1 className="mt-3 font-serif text-5xl leading-tight text-[#18352a]">
                        {course.title}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-[#687870]">
                        {course.description}
                    </p>
                </div>
                <aside className="sticky top-6 rounded-[28px] border border-[#e5ece6] bg-white p-7 shadow-sm">
                    <div className="flex items-center gap-4 text-sm text-[#708078]">
                        <span className="flex items-center gap-1 font-bold text-[#d59e25]">
                            <Star size={15} fill="currentColor" />{" "}
                            {course.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock3 size={15} />{" "}
                            {Math.ceil(course.durationMin / 60)} jam
                        </span>
                    </div>
                    <p className="mt-7 text-sm leading-6 text-[#708078]">
                        {course.modules.length} modul lapangan ·{" "}
                        {course.level.toLowerCase() === "beginner"
                            ? "pemula"
                            : course.level.toLowerCase() === "intermediate"
                              ? "menengah"
                              : "lanjutan"}
                    </p>
                    <div className="mt-7">
                        <EnrollButton
                            courseId={course.id}
                            enrolled={Boolean(enrollment)}
                        />
                    </div>
                    <div className="mt-8 border-t border-[#edf1ed] pt-6">
                        <h2 className="font-bold text-[#244337]">
                            Isi kursus ini
                        </h2>
                        <ol className="mt-4 space-y-3">
                            {course.modules.map((module) => (
                                <li
                                    key={module.id}
                                    className="flex gap-3 text-sm text-[#708078]"
                                >
                                    <span className="font-bold text-[#1f7a5c]">
                                        {module.position}.
                                    </span>
                                    {module.title}
                                </li>
                            ))}
                        </ol>
                    </div>
                </aside>
            </section>
        </main>
    );
}
