"use client";

import { useEffect, useState } from "react";

export function ReadingGate({
    skip,
    children,
}: {
    skip?: boolean;
    children: React.ReactNode;
}) {
    const [remaining, setRemaining] = useState(10);
    useEffect(() => {
        const timer = setInterval(
            () => setRemaining((value) => Math.max(0, value - 1)),
            1000,
        );
        return () => clearInterval(timer);
    }, []);
    if (!skip && remaining > 0)
        return (
            <p className="mt-8 rounded-xl bg-[#fff3ce] px-4 py-3 text-sm font-semibold text-[#8c6a1a]">
                Kuis terbuka dalam {Math.floor(remaining / 60)}:
                {String(remaining % 60).padStart(2, "0")}
            </p>
        );
    return <>{children}</>;
}
