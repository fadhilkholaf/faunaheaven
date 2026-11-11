"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
    useEffect(() => {
        const savedTheme = window.localStorage.getItem("faunaheaven-theme");
        document.documentElement.classList.toggle(
            "dark",
            savedTheme === "dark",
        );
    }, []);

    return null;
}
