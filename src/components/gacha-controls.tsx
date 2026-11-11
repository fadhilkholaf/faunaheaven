"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Draw = {
    id: string;
    isDuplicate?: boolean;
    prize: {
        faunaEntry: {
            id: string;
            name: string;
            imageUrl: string;
            rarity: string;
        };
    };
};
export function GachaControls({
    bannerId,
    spinCost,
    tenSpinCost,
}: {
    bannerId: string;
    spinCost: number;
    tenSpinCost: number;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [converting, setConverting] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [draws, setDraws] = useState<Draw[]>([]);
    const [showResults, setShowResults] = useState(false);
    async function spin(count: 1 | 10) {
        setBusy(true);
        setMessage("");
        setDraws([]);
        setShowResults(true);
        const response = await fetch("/api/ecokuji/spin", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                bannerId,
                count,
                requestKey: `${bannerId}-${count}-${crypto.randomUUID()}`,
            }),
        });
        const body = await response.json();
        if (response.ok) {
            setDraws(body.data.draws);
            setMessage(
                `${body.data.draws.length} kartu ditemukan!`,
            );
            router.refresh();
        } else {
            setShowResults(false);
            setMessage(body.error?.message ?? "Tarikan gagal.");
        }
        setBusy(false);
    }
    async function convertDuplicates() {
        const duplicateDraws = draws.filter((draw) => draw.isDuplicate);
        if (!duplicateDraws.length) return;
        setConverting("all");
        let totalCoins = 0;
        for (const draw of duplicateDraws) {
            const response = await fetch("/api/ecokuji/convert", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ faunaEntryId: draw.prize.faunaEntry.id }),
            });
            const body = await response.json();
            if (!response.ok) {
                setMessage(body.error?.message ?? "Could not convert duplicate.");
                setConverting(null);
                return;
            }
            totalCoins += body.data.coins;
        }
        setDraws((current) => current.map((draw) => ({ ...draw, isDuplicate: false })));
        setMessage(`${duplicateDraws.length} kartu duplikat ditukar menjadi ${totalCoins} koin.`);
        router.refresh();
        setConverting(null);
    }
    return (
        <div>
            <div className="flex gap-2">
                <button
                    disabled={busy}
                    onClick={() => spin(1)}
                    className="rounded-full bg-[#1f7a5c] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                >
                    Tarik 1 · {spinCost}
                </button>
                <button
                    disabled={busy}
                    onClick={() => spin(10)}
                    className="rounded-full bg-[#e87552] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                >
                    Tarik 10 · {tenSpinCost}
                </button>
            </div>
            {message && !showResults && (
                <p
                    role="status"
                    className="mt-3 text-sm font-semibold text-[#1f7a5c]"
                >
                    {message}
                </p>
            )}
            {showResults && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#17362b]/70 p-5 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Hasil tarikan EcoKuji"
                >
                    <div className="relative w-full max-w-3xl rounded-[30px] bg-[#fffaf4] p-6 shadow-2xl sm:p-9">
                        <button
                            type="button"
                            onClick={() => setShowResults(false)}
                            disabled={busy || Boolean(converting)}
                            className="absolute top-5 right-5 rounded-full px-3 py-1 text-xl text-[#708078] hover:bg-[#e8f0e8]"
                            aria-label="Tutup hasil"
                        >
                            ×
                        </button>
                        {busy ? (
                            <div className="flex min-h-[330px] flex-col items-center justify-center">
                                <div className="ecokuji-orbit">
                                    <span>✦</span>
                                    <span>✧</span>
                                    <span>✦</span>
                                </div>
                                <h3 className="mt-8 font-serif text-3xl text-[#18352a]">
                                    Sedang memanggil keajaiban...
                                </h3>
                                <p className="mt-2 text-sm text-[#708078]">
                                    Alam sedang memilih penemuan berikutnya
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs font-bold tracking-[0.16em] text-[#e87552] uppercase">
                                    Hasil EcoKuji
                                </p>
                                <h3 className="mt-2 font-serif text-3xl text-[#18352a]">
                                    {message}
                                </h3>
                                <div
                                    className={`mt-7 grid gap-3 ${draws.length > 1 ? "grid-cols-2 sm:grid-cols-5" : "mx-auto max-w-xs grid-cols-1"}`}
                                >
                                    {draws.map((draw, index) => (
                                        <div
                                            key={draw.id}
                                            className={`ecokuji-card-in rounded-2xl bg-white p-2 text-center shadow-sm ${draw.isDuplicate ? "ring-2 ring-[#e87552]" : ""}`}
                                            style={{
                                                animationDelay: `${index * 70}ms`,
                                            }}
                                        >
                                            <div className="aspect-square overflow-hidden rounded-xl bg-[#e3f2e8]">
                                                <img
                                                    src={
                                                        draw.prize.faunaEntry
                                                            .imageUrl
                                                    }
                                                    alt={
                                                        draw.prize.faunaEntry
                                                            .name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <p className="mt-2 truncate text-xs font-bold text-[#244337]">
                                                {draw.prize.faunaEntry.name}
                                            </p>
                                            <p className="text-[10px] font-bold text-[#e87552] uppercase">
                                                {draw.prize.faunaEntry.rarity.toLowerCase()}
                                            </p>
                                            {draw.isDuplicate && (
                                                <p className="mt-2 text-[10px] font-bold tracking-wide text-[#e87552] uppercase">Duplikat</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        disabled={Boolean(converting) || !draws.some((draw) => draw.isDuplicate)}
                                        onClick={convertDuplicates}
                                        className="w-full rounded-full bg-[#e87552] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                    >
                                        {converting === "all" ? "Menukar..." : "Tukar duplikat"}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={Boolean(converting)}
                                        onClick={() => setShowResults(false)}
                                        className="w-full rounded-full bg-[#1f7a5c] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                    >
                                        Lanjut menjelajah
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
