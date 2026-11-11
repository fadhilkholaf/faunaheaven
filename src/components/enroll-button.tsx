"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function EnrollButton({
    courseId,
    enrolled,
}: {
    courseId: string;
    enrolled: boolean;
}) {
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    async function enroll() {
        if (enrolled) {
            router.push(`/learn/${courseId}`);
            return;
        }
        setBusy(true);
        const response = await fetch("/api/courses", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ courseId }),
        });
        if (response.ok) router.push(`/learn/${courseId}`);
        else if (response.status === 401) router.push("/login");
        setBusy(false);
    }
    return (
        <button
            onClick={enroll}
            disabled={busy}
            className="rounded-full bg-[#e87552] px-6 py-3.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60"
        >
            {busy
                ? "Mendaftar..."
                : enrolled
                  ? "Lanjut belajar"
                  : "Daftar gratis"}
        </button>
    );
}
