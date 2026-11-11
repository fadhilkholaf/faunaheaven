"use client";
import { useMemo, useState } from "react";
type FAQ = { id: string; category: string; question: string; answer: string };
export function FAQList({ items }: { items: FAQ[] }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState<string | null>(null);
    const shown = useMemo(
        () =>
            items.filter((item) =>
                `${item.question} ${item.answer} ${item.category}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
            ),
        [items, query],
    );
    return (
        <>
            <input
                aria-label="Cari pertanyaan umum"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari pertanyaan..."
                className="w-full rounded-full border border-[#d8e2dc] bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#1f7a5c]"
            />
            <div className="mt-7 space-y-3">
                {shown.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-[#e5ece6] bg-white"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setOpen(open === item.id ? null : item.id)
                            }
                            aria-expanded={open === item.id}
                            className="flex w-full items-center justify-between px-5 py-5 text-left font-bold text-[#244337]"
                        >
                            <span>
                                <small className="mb-1 block text-xs tracking-wider text-[#e87552] uppercase">
                                    {item.category}
                                </small>
                                {item.question}
                            </span>
                            <span className="text-xl">
                                {open === item.id ? "−" : "+"}
                            </span>
                        </button>
                        {open === item.id && (
                            <p className="border-t border-[#edf1ed] px-5 pt-4 pb-5 leading-7 text-[#708078]">
                                {item.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
