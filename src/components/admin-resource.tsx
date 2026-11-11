"use client";
import { useEffect, useState } from "react";
export function AdminResource({
    entity,
    title,
}: {
    entity: string;
    title: string;
}) {
    const [items, setItems] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        fetch(`/api/admin/${entity}`)
            .then(async (response) => {
                const body = await response.json();
                if (!response.ok)
                    throw new Error(
                        body.error?.message ?? "Unable to load resource",
                    );
                setItems(body.data);
            })
            .catch((reason) => setError(reason.message))
            .finally(() => setLoading(false));
    }, [entity]);
    return (
        <section>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-xs font-bold tracking-wider text-[#e87552] uppercase">
                        Ruang kerja admin
                    </p>
                    <h1 className="mt-2 font-serif text-5xl text-[#18352a]">
                        {title}
                    </h1>
                </div>
                <button className="rounded-full bg-[#1f7a5c] px-5 py-3 text-sm font-bold text-white">
                    Tambah baru
                </button>
            </div>
            {loading ? (
                <div className="mt-8 rounded-2xl bg-white p-8 text-[#708078]">
                    Memuat...
                </div>
            ) : error ? (
                <div
                    role="alert"
                    className="mt-8 rounded-2xl bg-[#fff0e9] p-8 text-[#b54d32]"
                >
                    {error}
                </div>
            ) : (
                <div className="mt-8 overflow-x-auto rounded-2xl border border-[#e5ece6] bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-[#edf1ed] text-xs tracking-wider text-[#7b8981] uppercase">
                            <tr>
                        <th className="px-5 py-4">Nama</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={String(item.id)}
                                    className="border-b border-[#edf1ed] last:border-0"
                                >
                                    <td className="px-5 py-4 font-semibold text-[#244337]">
                                        {String(
                                            item.title ??
                                                item.name ??
                                                item.code ??
                                                item.question ??
                                                item.id,
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-[#708078]">
                                        {String(
                                            item.active ?? item.role ?? "Siap",
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <button className="text-sm font-bold text-[#e87552]">
                                            Ubah
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!items.length && (
                        <p className="p-8 text-center text-[#708078]">
                            Belum ada data.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
