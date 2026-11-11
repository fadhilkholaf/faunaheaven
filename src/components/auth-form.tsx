"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "../lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setBusy(true);
        const form = new FormData(event.currentTarget);
        const result =
            mode === "login"
                ? await authClient.signIn.email({
                      email: String(form.get("email")),
                      password: String(form.get("password")),
                  })
                : await authClient.signUp.email({
                      name: String(form.get("name")),
                      email: String(form.get("email")),
                      password: String(form.get("password")),
                  });
        setBusy(false);
        if (result.error)
            setError(result.error.message ?? "Tidak dapat melanjutkan.");
        else router.push("/profile");
    }
    return (
        <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
                <label className="block text-sm font-semibold text-[#385247]">
                    Nama
                    <input
                        name="name"
                        required
                        minLength={2}
                        className="mt-2 w-full rounded-xl border border-[#d8e2dc] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#1f7a5c]"
                    />
                </label>
            )}
            <label className="block text-sm font-semibold text-[#385247]">
                Surel
                <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-[#d8e2dc] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#1f7a5c]"
                />
            </label>
            <label className="block text-sm font-semibold text-[#385247]">
                Kata sandi
                <div className="relative mt-2">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        className="w-full rounded-xl border border-[#d8e2dc] bg-white px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#1f7a5c]"
                    />
                    <button
                        type="button"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-[#708078] hover:bg-[#e8f0e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f7a5c]"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </label>
            {error && (
                <p
                    role="alert"
                    className="rounded-xl bg-[#fff0e9] px-4 py-3 text-sm text-[#b54d32]"
                >
                    {error}
                </p>
            )}
            <button
                disabled={busy}
                className="w-full rounded-full bg-[#1f7a5c] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50"
            >
                {busy
                    ? "Memproses..."
                    : mode === "login"
                      ? "Masuk"
                      : "Buat akun"}
            </button>
        </form>
    );
}
