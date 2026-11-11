"use client";
import { useEffect, useState } from "react";
export function ThemeToggle() {
    const [dark, setDark] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem("faunaheaven-theme");
        const value = saved === "dark";
        queueMicrotask(() => setDark(value));
        document.documentElement.classList.toggle("dark", value);
    }, []);
    function toggle() {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("faunaheaven-theme", next ? "dark" : "light");
    }
    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-full border border-[#d8e2dc] px-3 py-2 text-xs font-bold text-[#52605a]"
        >
            {dark ? "Light" : "Dark"}
        </button>
    );
}
