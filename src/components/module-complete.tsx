"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function ModuleComplete({
    courseId,
    moduleId,
    complete,
    final,
}: {
    courseId: string;
    moduleId: string;
    complete: boolean;
    final: boolean;
}) {
    const [done, setDone] = useState(complete);
    const [message, setMessage] = useState("");
    const router = useRouter();
    async function mark() {
        const response = await fetch("/api/learning/complete", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ courseId, moduleId }),
        });
        const result = await response.json();
        if (response.ok) {
            setDone(true);
            router.refresh();
            if (result.data.isComplete || final) {
                setMessage(
                    `Kursus selesai — ${result.data.rewardCoins} koin ditambahkan ke dompetmu.`,
                );
                setTimeout(() => router.push(`/courses/${courseId}`), 1800);
            }
        } else setMessage(result.error?.message ?? "Tidak dapat menyimpan progres.");
    }
    return (
        <div className="mt-8">
            {message && (
                <p
                    role="status"
                    className="mb-4 rounded-2xl bg-[#e3f2e8] px-4 py-3 text-sm font-semibold text-[#1f7a5c]"
                >
                    {message}
                </p>
            )}
            <button
                onClick={mark}
                disabled={done}
                className="rounded-full bg-[#1f7a5c] px-6 py-3 text-sm font-bold text-white disabled:bg-[#d8e7dd] disabled:text-[#42705b]"
            >
                {done ? "Modul selesai" : "Tandai modul selesai"}
            </button>
        </div>
    );
}
