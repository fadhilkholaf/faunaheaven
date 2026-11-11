"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DailyReward({ claimed }: { claimed: boolean }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(claimed);
    const [message, setMessage] = useState("");

    async function claim() {
        setBusy(true);
        const response = await fetch("/api/rewards/daily", { method: "POST" });
        const body = await response.json();
        if (response.ok) {
            setDone(true);
            setMessage(body.data.rewardCoins ? `+${body.data.rewardCoins} koin masuk ke dompetmu.` : "Hadiah hari ini sudah diambil.");
            router.refresh();
        } else setMessage(body.error?.message ?? "Hadiah harian belum dapat diambil.");
        setBusy(false);
    }

    return <section className="mt-8 rounded-[24px] border border-[#f0d99a] bg-[#fff3ce] p-6 dark:border-[#665324] dark:bg-[#3b321d]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="text-xs font-bold uppercase tracking-wider text-[#a87918]">Hadiah harian</p><h2 className="mt-2 text-xl font-bold text-[#6f5312] dark:text-[#f4ca62]">Kembali setiap hari, dapatkan 25 koin</h2><p className="mt-1 text-sm text-[#8c6a1a] dark:text-[#e5c978]">Satu klaim untuk setiap hari.</p></div>
            <button type="button" onClick={claim} disabled={busy || done} className="rounded-full bg-[#e87552] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Mengambil..." : done ? "Sudah diambil" : "Ambil hadiah"}</button>
        </div>
        {message && <p role="status" className="mt-4 text-sm font-semibold text-[#6f5312] dark:text-[#f4ca62]">{message}</p>}
    </section>;
}
