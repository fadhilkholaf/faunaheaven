"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Coins, Menu, PawPrint, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SignOutButton } from "./session-nav";

type MainNavProps = { userName?: string | null; coins?: number | null };

export function MainNav({ userName, coins: initialCoins }: MainNavProps) {
    const [open, setOpen] = useState(false);
    const [liveName, setLiveName] = useState<string | null>(null);
    const [liveCoins, setLiveCoins] = useState<number | null>(
        initialCoins ?? null,
    );
    useEffect(() => {
        if (!userName) return;
        Promise.all([fetch("/api/wallet"), fetch("/api/profile")])
            .then(async ([walletResponse, profileResponse]) => {
                const walletBody = walletResponse.ok
                    ? await walletResponse.json()
                    : null;
                const profileBody = profileResponse.ok
                    ? await profileResponse.json()
                    : null;
                if (walletBody?.data?.coins !== undefined)
                    setLiveCoins(walletBody.data.coins);
                if (profileBody?.data?.displayName)
                    setLiveName(profileBody.data.displayName);
            })
            .catch(() => undefined);
    }, [userName]);
    const coins = initialCoins ?? liveCoins ?? 0;
    const displayName = liveName ?? userName;
    const links = [
        ["/#catalog", "Kursus"],
        ["/journal", "Jurnal"],
        ["/ecokuji", "EcoKuji"],
        ["/faunadex", "FaunaDex"],
        ["/leaderboard", "Peringkat"],
        ["/promo", "Kode promo"],
        ["/missions", "Misi"],
        ["/faq", "FAQ"],
    ];
    return (
        <header className="sticky top-0 z-40 border-b border-[#e9eee9] bg-[#fffaf4]/90 shadow-[0_4px_20px_rgba(31,66,48,.04)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
            <nav
                className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-3.5 lg:px-8"
                aria-label="Navigasi utama"
            >
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-[#1e2925] dark:text-white"
                >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[#1f7a5c] text-white">
                        <PawPrint size={19} />
                    </span>
                    Fauna<span className="text-[#e87552]">Heaven</span>
                </Link>
                <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 text-sm font-semibold text-[#52605a] xl:flex dark:text-slate-300">
                    {links.map(([href, label]) => (
                        <Link
                            key={href}
                            href={href}
                            className="rounded-full px-3 py-2 transition hover:bg-[#e8f0e8] hover:text-[#1f7a5c] dark:hover:bg-slate-800"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
                <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex">
                    <ThemeToggle />
                    {userName ? (
                        <>
                            <Link
                                href="/profile"
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#f0d99a] bg-[#fff8df] px-3 py-2 text-xs font-bold text-[#9b741d] dark:border-[#665324] dark:bg-[#3b321d] dark:text-[#f4ca62]"
                            >
                                <Coins size={14} />
                                {coins ?? 0}
                            </Link>
                            <Link
                                href="/profile"
                                className="max-w-28 truncate rounded-full px-3 py-2 text-sm font-bold text-[#1f7a5c] hover:bg-[#e8f0e8] dark:hover:bg-slate-800"
                            >
                                {displayName}
                            </Link>
                            <SignOutButton />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-[#1f7a5c] px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Masuk
                        </Link>
                    )}
                </div>
                <button
                    type="button"
                    aria-label={
                        open ? "Tutup menu navigasi" : "Buka menu navigasi"
                    }
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    className="ml-auto rounded-xl border border-[#d8e2dc] p-2 text-[#244337] xl:hidden dark:border-slate-700 dark:text-white"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>
            {open && (
                <div className="border-t border-[#e9eee9] bg-[#fffaf4] px-6 pt-3 pb-5 xl:hidden dark:border-slate-800 dark:bg-slate-950">
                    <div className="grid gap-1">
                        {links.map(([href, label]) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-3 py-3 text-sm font-semibold text-[#52605a] hover:bg-[#e3f2e8] dark:text-slate-300"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center gap-4 border-t border-[#e9eee9] pt-4 dark:border-slate-800">
                        <ThemeToggle />
                        {userName ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#fff3ce] px-3 py-2 text-xs font-bold text-[#9b741d] dark:bg-[#3b321d] dark:text-[#f4ca62]"
                                >
                                    <Coins size={14} />
                                    {coins ?? 0}
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={() => setOpen(false)}
                                    className="text-sm font-bold text-[#1f7a5c]"
                                >
                                    {displayName}
                                </Link>
                                <SignOutButton />
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-full bg-[#1f7a5c] px-4 py-2 text-sm font-semibold text-white"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
