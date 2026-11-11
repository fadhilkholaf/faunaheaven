"use client";
import { useState } from "react";
export function PromoForm() {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    async function redeem() {
        const response = await fetch("/api/promos/redeem", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ code }),
        });
        const body = await response.json();
        setMessage(
            response.ok
                ? `Berhasil ditukar! +${body.data.coins} koin.`
                : (body.error?.message ?? "Tidak dapat menukar kode."),
        );
    }
    return (
        <div className="flex flex-wrap gap-3">
            <input
                aria-label="Kode promo"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Masukkan kode promo"
                className="rounded-full border border-[#d8e2dc] px-5 py-3 outline-none focus:ring-2 focus:ring-[#1f7a5c]"
            />
            <button
                onClick={redeem}
                className="rounded-full bg-[#1f7a5c] px-5 py-3 text-sm font-bold text-white"
            >
                Tukar
            </button>
            {message && (
                <span
                    role="status"
                    className="basis-full text-sm font-semibold text-[#1f7a5c]"
                >
                    {message}
                </span>
            )}
        </div>
    );
}
