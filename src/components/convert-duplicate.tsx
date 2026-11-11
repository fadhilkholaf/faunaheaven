"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConvertDuplicate({ faunaEntryId }: { faunaEntryId: string }) {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    async function convert() {
        setBusy(true);
        const response = await fetch("/api/ecokuji/convert", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ faunaEntryId }),
        });
        const body = await response.json();
        setMessage(
            response.ok
                ? `+${body.data.coins} koin`
                : (body.error?.message ?? "Tidak dapat menukar duplikat."),
        );
        if (response.ok) router.refresh();
        setBusy(false);
    }
    return (
        <div className="mt-3">
            <button
                type="button"
                disabled={busy}
                onClick={convert}
                className="rounded-full bg-[#fff3ce] px-3 py-1.5 text-[11px] font-bold text-[#9b741d] disabled:opacity-50"
            >
                {busy ? "Menukar..." : "Tukar duplikat"}
            </button>
            {message && (
                <span
                    role="status"
                    className="ml-2 text-[11px] font-semibold text-[#1f7a5c]"
                >
                    {message}
                </span>
            )}
        </div>
    );
}
