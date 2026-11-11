"use client";

import { useState } from "react";
import { ArrowRight, Clock3, Search, Star } from "lucide-react";

type Course = {
    id: string;
    slug: string;
    provider: string;
    title: string;
    description: string;
    imageUrl: string;
    rating: number;
    level: string;
    durationMin: number;
    category: { name: string; slug: string };
};

export function CourseCatalog({ courses }: { courses: Course[] }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const categories = [
        "all",
        ...Array.from(new Set(courses.map((course) => course.category.slug))),
    ];
    const levelLabels: Record<string, string> = {
        beginner: "pemula",
        intermediate: "menengah",
        advanced: "lanjutan",
    };
    const filtered = courses.filter(
        (course) =>
            (category === "all" || course.category.slug === category) &&
            `${course.title} ${course.description} ${course.provider}`
                .toLowerCase()
                .includes(query.toLowerCase()),
    );
    return (
        <section
            id="catalog"
            className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28"
        >
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#1f7a5c] uppercase">
                        Pelajari kehidupan di sekitar kita
                    </p>
                    <h2 className="font-serif text-4xl font-medium tracking-tight text-[#18352a] sm:text-5xl">
                        Kursus untuk manusia yang ingin tahu.
                    </h2>
                </div>
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8c9a92]" />
                    <label htmlFor="course-search" className="sr-only">
                        Cari kursus
                    </label>
                    <input
                        id="course-search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari catatan lapangan..."
                        className="w-full rounded-full border border-[#dce7df] bg-white py-3 pr-5 pl-11 text-sm ring-[#1f7a5c] outline-none placeholder:text-[#9aa79f] focus:ring-2"
                    />
                </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
                {categories.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${category === item ? "bg-[#1f7a5c] text-white" : "border border-[#dce7df] bg-white text-[#617169] hover:border-[#9db9aa]"}`}
                    >
                        {item === "all" ? "semua" : item.replaceAll("-", " ")}
                    </button>
                ))}
            </div>
            {filtered.length ? (
                <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((course) => (
                        <article
                            key={course.id}
                            className="group overflow-hidden rounded-[26px] border border-[#e5ece6] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(57,87,68,.1)]"
                        >
                            <div className="relative aspect-[1.45] overflow-hidden bg-[#e5efea]">
                                <img
                                    src={course.imageUrl}
                                    alt={course.title}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-[#1f7a5c] uppercase">
                                    {levelLabels[course.level.toLowerCase()] ?? course.level.toLowerCase()}
                                </span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs font-bold tracking-[0.12em] text-[#e87552] uppercase">
                                    {course.provider}
                                </p>
                                <h3 className="mt-2 text-xl font-bold text-[#244337]">
                                    {course.title}
                                </h3>
                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#75847b]">
                                    {course.description}
                                </p>
                                <div className="mt-5 flex items-center gap-4 text-xs font-semibold text-[#7a8980]">
                                    <span className="flex items-center gap-1 text-[#d59e25]">
                                        <Star size={14} fill="currentColor" />{" "}
                                        {course.rating.toFixed(1)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                    <Clock3 size={14} />{" "}
                                        {Math.ceil(course.durationMin / 60)} jam belajar
                                    </span>
                                </div>
                                <a
                                    href={`/courses/${course.slug}`}
                                    className="mt-6 flex items-center justify-between border-t border-[#edf1ed] pt-4 text-sm font-bold text-[#1f7a5c]"
                                >
                                    Jelajahi kursus <ArrowRight size={16} />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="mt-9 rounded-[26px] border border-dashed border-[#cddbd1] bg-white p-12 text-center text-[#718078]">
                    Belum ada kursus yang cocok dengan pencarianmu.
                </div>
            )}
        </section>
    );
}
