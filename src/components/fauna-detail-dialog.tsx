"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type FaunaEntry = {
    id: string;
    name: string;
    scientificName: string;
    description: string;
    imageUrl: string;
    habitat: string;
    rarity: string;
};

export function FaunaDetailDialog({ entry, quantity }: { entry: FaunaEntry; quantity: number }) {
    return <Dialog>
        <DialogTrigger className="mt-3 rounded-full border border-[#d8e2dc] px-3 py-1.5 text-[11px] font-bold text-[#1f7a5c] hover:bg-[#e8f0e8] dark:border-[#315342] dark:hover:bg-[#1d3d30]">Lihat detail</DialogTrigger>
        <DialogContent className="w-[calc(100%-2rem)] max-h-[90vh] max-w-4xl overflow-y-auto rounded-[28px] bg-[#fffaf4] p-0 dark:bg-[#172d25] sm:w-[min(90vw,64rem)] sm:max-w-4xl">
            <div className="grid sm:grid-cols-[.9fr_1.1fr]">
                <img src={entry.imageUrl} alt={entry.name} className="h-full min-h-64 w-full object-cover" />
                <div className="p-7 sm:p-9">
                    <DialogHeader><p className="text-xs font-bold uppercase tracking-wider text-[#e87552]">Detail fauna</p><DialogTitle className="mt-2 font-serif text-4xl text-[#18352a] dark:text-[#e7f1eb]">{entry.name}</DialogTitle><DialogDescription className="text-sm italic text-[#708078] dark:text-[#b4c8bd]">{entry.scientificName}</DialogDescription></DialogHeader>
                    <div className="mt-7">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1f7a5c] dark:text-[#8ed1ae]">Tentang fauna</p>
                        <p className="mt-2 max-h-64 overflow-y-auto pr-3 text-base leading-7 text-[#52635a] dark:text-[#b4c8bd]">{entry.description}</p>
                    </div>
                    <dl className="mt-7 grid grid-cols-2 gap-4 text-sm"><div className="rounded-xl bg-[#e3f2e8] p-3 dark:bg-[#1d3d30]"><dt className="text-xs text-[#708078] dark:text-[#b4c8bd]">Habitat</dt><dd className="mt-1 font-bold text-[#244337] dark:text-[#e7f1eb]">{entry.habitat}</dd></div><div className="rounded-xl bg-[#fff3ce] p-3 dark:bg-[#3b321d]"><dt className="text-xs text-[#8c6a1a] dark:text-[#e5c978]">Kelangkaan</dt><dd className="mt-1 font-bold text-[#6f5312] dark:text-[#f4ca62]">{entry.rarity.toLowerCase()}</dd></div></dl>
                    <p className="mt-5 text-sm font-bold text-[#1f7a5c]">Koleksimu: {quantity ? `x${quantity}` : "Belum ditemukan"}</p>
                </div>
            </div>
        </DialogContent>
    </Dialog>;
}
