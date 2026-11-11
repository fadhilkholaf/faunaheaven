import type { PrismaClient } from "../../generated/prisma/client";
import { CoinTransactionType, MissionType } from "../../generated/prisma/enums";
import { quizReward } from "./reward-rules";
import { incrementMission } from "./gamification";

type Db = PrismaClient;

export async function enrollInCourse(db: Db, userId: string, courseId: string) {
    const course = await db.course.findUnique({
        where: { id: courseId },
        select: { id: true },
    });
    if (!course) throw new Error("COURSE_NOT_FOUND");
    return db.courseEnrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId },
        update: {},
    });
}

export async function completeModule(
    db: Db,
    userId: string,
    courseId: string,
    moduleId: string,
) {
    const result = await db.$transaction(async (tx) => {
        const enrollment = await tx.courseEnrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        const courseModule = await tx.courseModule.findFirst({
            where: { id: moduleId, courseId },
            include: {
                course: {
                    include: { modules: { orderBy: { position: "asc" } } },
                },
            },
        });
        if (!enrollment || !courseModule) throw new Error("NOT_ENROLLED");
        const existingProgress = await tx.courseProgress.findUnique({
            where: { userId_courseId_moduleId: { userId, courseId, moduleId } },
        });
        await tx.courseProgress.upsert({
            where: { userId_courseId_moduleId: { userId, courseId, moduleId } },
            create: { userId, courseId, moduleId },
            update: {},
        });
        const completedCount = await tx.courseProgress.count({
            where: { userId, courseId },
        });
        const isComplete = completedCount >= courseModule.course.modules.length;
        if (isComplete) {
            const existingReward = await tx.courseReward.findUnique({
                where: { userId_courseId: { userId, courseId } },
            });
            if (!existingReward) {
                const reward = await tx.courseReward.create({
                    data: {
                        userId,
                        courseId,
                        coins: courseModule.course.rewardCoins,
                    },
                });
                await tx.wallet.upsert({
                    where: { userId },
                    create: { userId, coins: reward.coins },
                    update: { coins: { increment: reward.coins } },
                });
                await tx.coinTransaction.create({
                    data: {
                        userId,
                        type: CoinTransactionType.COURSE_REWARD,
                        referenceId: courseId,
                        amount: reward.coins,
                        description: `Completed ${courseModule.course.title}`,
                    },
                });
            }
        }
        return {
            completedCount,
            total: courseModule.course.modules.length,
            isComplete,
            newlyCompleted: !existingProgress,
            rewardCoins: isComplete ? courseModule.course.rewardCoins : 0,
        };
    });
    if (result.newlyCompleted)
        await incrementMission(userId, MissionType.COURSE_MODULE);
    return result;
}

export async function submitQuiz(
    db: Db,
    userId: string,
    journalId: string,
    attemptKey: string,
    answers: Record<string, number>,
) {
    const result = await db.$transaction(async (tx) => {
        const journal = await tx.journal.findUnique({
            where: { id: journalId },
            include: { questions: true },
        });
        if (!journal) throw new Error("JOURNAL_NOT_FOUND");
        const existing = await tx.quizAttempt.findUnique({
            where: { attemptKey },
        });
        const existingForJournal = await tx.quizAttempt.findFirst({
            where: { userId, journalId },
            orderBy: { createdAt: "asc" },
        });
        if (existingForJournal)
            return {
                score: existingForJournal.score,
                total: existingForJournal.total,
                rewardCoins: existingForJournal.rewardCoins,
                answers: existingForJournal.answers as Record<string, number>,
                completedAt: existingForJournal.createdAt,
                duplicate: true,
                alreadyCompleted: true,
            };
        if (existing)
            return {
                score: existing.score,
                total: existing.total,
                rewardCoins: existing.rewardCoins,
                answers: existing.answers as Record<string, number>,
                completedAt: existing.createdAt,
                duplicate: true,
                alreadyCompleted: true,
            };
        const score = journal.questions.reduce(
            (total, question) =>
                total + (answers[question.id] === question.answerIndex ? 1 : 0),
            0,
        );
        const rewardCoins = quizReward(score, journal.questions.length);
        const attempt = await tx.quizAttempt.create({
            data: {
                userId,
                journalId,
                attemptKey,
                score,
                total: journal.questions.length,
                rewardCoins,
                answers,
            },
        });
        await tx.wallet.upsert({
            where: { userId },
            create: { userId, coins: rewardCoins },
            update: { coins: { increment: rewardCoins } },
        });
        await tx.coinTransaction.upsert({
            where: {
                userId_type_referenceId: {
                    userId,
                    type: CoinTransactionType.QUIZ_REWARD,
                    referenceId: attempt.id,
                },
            },
            create: {
                userId,
                type: CoinTransactionType.QUIZ_REWARD,
                referenceId: attempt.id,
                amount: rewardCoins,
                description: `Quiz reward: ${journal.title}`,
            },
            update: {},
        });
        return {
            score,
            total: journal.questions.length,
            rewardCoins,
            answers,
            completedAt: attempt.createdAt,
            duplicate: false,
            alreadyCompleted: true,
        };
    });
    if (!result.duplicate)
        await incrementMission(userId, MissionType.QUIZ_COMPLETE);
    return result;
}
