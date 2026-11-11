"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type Prize = { stock: number; weight: number; rarity: string; faunaEntry: { name: string; imageUrl: string } };

const rarityOrder = ["LEGENDARY", "EPIC", "RARE", "COMMON"];
const rarityLabels: Record<string, string> = { LEGENDARY: "Legendaris", EPIC: "Epik", RARE: "Langka", COMMON: "Umum" };

export function GachaChanceDialog({ title, imageUrl, prizes }: { title: string; imageUrl: string; prizes: Prize[] }) {
    const available = prizes.filter((prize) => prize.stock > 0);
    const weighted = available.map((prize) => ({ ...prize, effectiveWeight: prize.weight * (prize.rarity === "COMMON" ? 5 : 1) }));
    const totalWeight = weighted.reduce((sum, prize) => sum + prize.effectiveWeight, 0);
    const percent = (value: number) => totalWeight ? `${((value / totalWeight) * 100).toFixed(1)}%` : "0%";
    const rarityChances = rarityOrder.map((rarity) => ({ rarity, chance: percent(weighted.filter((prize) => prize.rarity === rarity).reduce((sum, prize) => sum + prize.effectiveWeight, 0)) })).filter((item) => item.chance !== "0%" );

    return <Dialog>
        <DialogTrigger className="block w-full cursor-pointer text-left"><img src={imageUrl} alt={title} className="aspect-[16/9] w-full object-cover transition duration-300 hover:brightness-90" /><span className="sr-only">Lihat peluang {title}</span></DialogTrigger>
        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-[28px] bg-[#fffaf4] dark:bg-[#172d25] sm:w-[min(90vw,48rem)] sm:max-w-3xl">
            <DialogHeader><p className="text-xs font-bold uppercase tracking-wider text-[#e87552]">Peluang EcoKuji</p><DialogTitle className="font-serif text-3xl text-[#18352a] dark:text-[#e7f1eb]">{title}</DialogTitle><DialogDescription className="text-[#708078] dark:text-[#b4c8bd]">Peluang dihitung dari bobot hadiah dan hanya mencakup koleksi yang stoknya masih tersedia.</DialogDescription></DialogHeader>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">{rarityChances.map((item) => <div key={item.rarity} className="rounded-2xl bg-[#e3f2e8] p-4 dark:bg-[#1d3d30]"><p className="text-xs font-bold uppercase text-[#708078] dark:text-[#b4c8bd]">{rarityLabels[item.rarity]}</p><p className="mt-2 text-2xl font-bold text-[#1f7a5c]">{item.chance}</p></div>)}</div>
            <div className="mt-7"><h3 className="font-bold text-[#244337] dark:text-[#e7f1eb]">Koleksi yang tersedia</h3><div className="mt-3 grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">{weighted.map((prize) => <div key={prize.faunaEntry.name} className="flex items-center gap-3 rounded-xl border border-[#e5ece6] bg-white p-2 dark:border-[#29483b] dark:bg-[#12251e]"><img src={prize.faunaEntry.imageUrl} alt="" className="size-12 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#244337] dark:text-[#e7f1eb]">{prize.faunaEntry.name}</p><p className="text-xs text-[#708078] dark:text-[#b4c8bd]">{rarityLabels[prize.rarity] ?? prize.rarity.toLowerCase()} · {percent(prize.effectiveWeight)}</p></div><span className="text-[10px] font-semibold text-[#87948c]">Stok {prize.stock}</span></div>)}</div></div>
        </DialogContent>
    </Dialog>;
}
