"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function ProfileForm({
    displayName,
    bio,
}: {
    displayName: string;
    bio: string;
}) {
    const router = useRouter();
    const [name, setName] = useState(displayName);
    const [about, setAbout] = useState(bio);
    const [saved, setSaved] = useState(false);
    async function save() {
        const response = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ displayName: name, bio: about }),
        });
        setSaved(response.ok);
        if (response.ok) router.refresh();
    }
    return (
        <div className="mt-8 rounded-[24px] border border-[#e5ece6] bg-white p-6">
            <h2 className="text-lg font-bold text-[#244337]">
                Ubah profilmu
            </h2>
            <label className="mt-5 block text-sm font-semibold text-[#52635a]">
                Nama tampilan
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#d8e2dc] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1f7a5c]"
                />
            </label>
            <label className="mt-4 block text-sm font-semibold text-[#52635a]">
                Bio
                <textarea
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-[#d8e2dc] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1f7a5c]"
                />
            </label>
            <div className="mt-5 flex items-center gap-4">
                <button
                    onClick={save}
                    className="rounded-full bg-[#1f7a5c] px-5 py-3 text-sm font-bold text-white"
                >
                    Simpan perubahan
                </button>
                {saved && (
                    <span
                        role="status"
                        className="text-sm font-semibold text-[#1f7a5c]"
                    >
                        Tersimpan.
                    </span>
                )}
            </div>
        </div>
    );
}
