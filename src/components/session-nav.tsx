"use client";

import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

export function SignOutButton() {
    const router = useRouter();
    async function signOut() {
        await authClient.signOut();
        router.refresh();
    }
    return (
        <button
            type="button"
            onClick={signOut}
            className="text-sm font-semibold text-[#52605a] transition hover:text-[#1f7a5c]"
        >
            Keluar
        </button>
    );
}
