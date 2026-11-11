import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { QuizCard } from "../../../components/quiz-card";
import { ReadingGate } from "../../../components/reading-gate";
import { getCurrentUser } from "../../../lib/server-auth";

export const dynamic = "force-dynamic";

export default async function JournalDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const categoryLabels: Record<string, string> = {
        wildlife: "Satwa liar",
        conservation: "Konservasi",
        climate: "Iklim",
        community: "Komunitas",
    };
    const journal = await prisma.journal.findUnique({
        where: { slug },
        include: { questions: { orderBy: { position: "asc" } } },
    });
    if (!journal) notFound();
    const questions = journal.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options as string[],
    }));
    const user = await getCurrentUser();
    const attempt = user
        ? await prisma.quizAttempt.findFirst({
              where: { userId: user.id, journalId: journal.id },
              orderBy: { createdAt: "asc" },
          })
        : null;
    return (
        <main className="min-h-screen bg-[#fffaf4] px-6 py-10 text-[#1e2925] lg:px-10">
            <article className="mx-auto max-w-3xl">
                <Link href="/journal" className="font-bold text-[#1f7a5c]">
                    ← Semua cerita jurnal
                </Link>
                <img
                    src={journal.imageUrl}
                    alt={journal.title}
                    className="mt-10 aspect-[1.8] w-full rounded-[30px] object-cover"
                />
                <p className="mt-10 text-xs font-bold tracking-[0.16em] text-[#e87552] uppercase">
                    {categoryLabels[journal.category.toLowerCase()] ?? journal.category} · {journal.readingMin} menit baca
                </p>
                <h1 className="mt-3 font-serif text-5xl leading-tight text-[#18352a]">
                    {journal.title}
                </h1>
                <p className="mt-6 text-xl leading-8 text-[#687870]">
                    {journal.excerpt}
                </p>
                <div className="mt-10 space-y-6 text-lg leading-9 text-[#52635a]">
                    <p>{journal.content}</p>
                    <p>
                        Belajar dan peduli tidak pernah terpisah. Semakin kita
                        memperhatikan, semakin bijak kita berbagi ruang hidup
                        yang menjadi rumah bersama.
                    </p>
                </div>
                <ReadingGate skip={Boolean(attempt)}>
                    <QuizCard
                        journalId={journal.id}
                        questions={questions}
                        initialAttempt={
                            attempt
                                ? {
                                      score: attempt.score,
                                      total: attempt.total,
                                      rewardCoins: attempt.rewardCoins,
                                      answers: attempt.answers as Record<
                                          string,
                                          number
                                      >,
                                      completedAt: attempt.createdAt.toISOString(),
                                  }
                                : undefined
                        }
                    />
                </ReadingGate>
            </article>
        </main>
    );
}
