"use client";
import { useState } from "react";
export function MissionClaim({
    missionId,
    ready,
}: {
    missionId: string;
    ready: boolean;
}) {
    const [message, setMessage] = useState("");
    const [claimed, setClaimed] = useState(false);
    const [busy, setBusy] = useState(false);
    async function claim() {
        setBusy(true);
        const response = await fetch("/api/missions/claim", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ missionId }),
        });
        const body = await response.json();
        if (response.ok) {
            setClaimed(true);
            setMessage(`Berhasil diklaim +${body.data.coins} koin`);
        } else setMessage(body.error?.message ?? "Belum siap");
        setBusy(false);
    }
    return (
        <div>
            {!claimed && <button
                disabled={!ready || busy}
                onClick={claim}
                className="rounded-full bg-[#1f7a5c] px-4 py-2 text-xs font-bold text-white disabled:bg-[#d8e7dd] disabled:text-[#42705b]"
            >
                {busy ? "Mengklaim..." : "Klaim hadiah"}
            </button>}
            {claimed && <span className="text-[#1f7a5c]">Diklaim</span>}
            {message && (
                <p className="mt-2 text-xs text-[#1f7a5c]">{message}</p>
            )}
        </div>
    );
}
