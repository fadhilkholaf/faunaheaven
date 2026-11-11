"use client";
import { useState } from "react";
type Question = { id: string; question: string; options: string[] };
type QuizResult = {
    score: number;
    total: number;
    rewardCoins: number;
    answers: Record<string, number>;
    completedAt?: string;
};
export function QuizCard({
    journalId,
    questions,
    initialAttempt,
}: {
    journalId: string;
    questions: Question[];
    initialAttempt?: QuizResult;
}) {
    const [answers, setAnswers] = useState<Record<string, number>>(
        initialAttempt?.answers ?? {},
    );
    const [result, setResult] = useState<QuizResult | null>(
        initialAttempt ?? null,
    );
    const [busy, setBusy] = useState(false);
    async function submit() {
        setBusy(true);
        const response = await fetch("/api/journal/quiz", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                journalId,
                attemptKey: `${journalId}-${Date.now()}`,
                answers,
            }),
        });
        const body = await response.json();
        if (response.ok) setResult(body.data);
        setBusy(false);
    }
    return (
        <section className="mt-12 rounded-[28px] bg-[#e3f2e8] p-7 sm:p-9">
            <p className="text-xs font-bold tracking-[0.16em] text-[#1f7a5c] uppercase">
                Uji catatan lapanganmu
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[#18352a]">
                Kuis singkat
            </h2>
            {result ? (
                <div className="mt-7 space-y-4">
                    <div className="rounded-xl bg-white px-4 py-4 text-[#1f7a5c]" role="status">
                        <p className="font-bold">Kuis selesai: {result.score}/{result.total}</p>
                        <p className="mt-1 text-sm font-semibold">Hadiah: {result.rewardCoins} koin</p>
                        {result.completedAt && <p className="mt-1 text-xs text-[#708078]">Selesai {new Date(result.completedAt).toLocaleString("id-ID")}</p>}
                    </div>
                    <div className="rounded-xl border border-[#d8e2dc] bg-white/70 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#e87552]">Riwayat jawaban</p>
                        <ol className="mt-3 space-y-3 text-sm text-[#52635a]">
                            {questions.map((question, index) => <li key={question.id}><span className="font-bold text-[#244337]">{index + 1}. </span>{question.options[answers[question.id]] ?? "Tidak dijawab"}</li>)}
                        </ol>
                    </div>
                    <p className="text-sm font-semibold text-[#708078]">Kuis ini hanya dapat dikerjakan satu kali.</p>
                </div>
            ) : questions.map((question, index) => (
                <fieldset key={question.id} className="mt-7">
                    <legend className="font-bold text-[#244337]">
                        {index + 1}. {question.question}
                    </legend>
                    <div className="mt-3 grid gap-2">
                        {question.options.map((option, optionIndex) => (
                            <label
                                key={option}
                                className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-[#52635a]"
                            >
                                <input
                                    type="radio"
                                    name={question.id}
                                    checked={
                                        answers[question.id] === optionIndex
                                    }
                                    onChange={() =>
                                        setAnswers({
                                            ...answers,
                                            [question.id]: optionIndex,
                                        })
                                    }
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </fieldset>
            ))}
            {!result && (
                <button
                    onClick={submit}
                    disabled={
                        busy || Object.keys(answers).length !== questions.length
                    }
                    className="mt-8 rounded-full bg-[#1f7a5c] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                    {busy ? "Memeriksa..." : "Kirim jawaban"}
                </button>
            )}
        </section>
    );
}
