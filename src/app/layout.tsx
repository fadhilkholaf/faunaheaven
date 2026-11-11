import type { Metadata } from "next";
import { DM_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeInitializer } from "../components/theme-initializer";

const fontSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontSerif = Lora({
    subsets: ["latin"],
    variable: "--font-serif",
});

const fontMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400"],
});

export const metadata: Metadata = {
    title: "FaunaHeaven — Belajar tentang alam",
    description:
        "Edukasi satwa liar, kursus konservasi, catatan lapangan, dan koleksi keajaiban alam.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="id"
            className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <ThemeInitializer />
                {children}
            </body>
        </html>
    );
}
