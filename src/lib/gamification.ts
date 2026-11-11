import { prisma } from "./prisma";
import {
    CoinTransactionType,
    CollectionTransactionType,
    MissionType,
    PrizeRarity,
} from "../../generated/prisma/enums";

const rarityRank: Record<PrizeRarity, number> = {
    COMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4,
};

const DAILY_REWARD_COINS = 25;

function dailyRewardReference(date = new Date()) {
    return `daily-reward-${date.toISOString().slice(0, 10)}`;
}

export async function claimDailyReward(userId: string) {
    const referenceId = dailyRewardReference();
    return prisma.$transaction(async (tx) => {
        const existing = await tx.coinTransaction.findUnique({
            where: {
                userId_type_referenceId: {
                    userId,
                    type: CoinTransactionType.DAILY_REWARD,
                    referenceId,
                },
            },
        });
        const wallet = await tx.wallet.upsert({
            where: { userId },
            create: { userId, coins: 0 },
            update: {},
        });
        if (existing)
            return {
                claimed: true,
                rewardCoins: 0,
                coins: wallet.coins,
                referenceId,
            };
        const updatedWallet = await tx.wallet.update({
            where: { userId },
            data: { coins: { increment: DAILY_REWARD_COINS } },
        });
        await tx.coinTransaction.create({
            data: {
                userId,
                type: CoinTransactionType.DAILY_REWARD,
                referenceId,
                amount: DAILY_REWARD_COINS,
                description: "Hadiah harian",
            },
        });
        return {
            claimed: true,
            rewardCoins: DAILY_REWARD_COINS,
            coins: updatedWallet.coins,
            referenceId,
        };
    });
}

export { dailyRewardReference };

function isActive(
    startsAt: Date | null,
    endsAt: Date | null,
    now = new Date(),
) {
    return (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now);
}

function pickWeighted<T extends { weight: number }>(items: T[]) {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * total;
    return (
        items.find((item) => (cursor -= item.weight) <= 0) ??
        items[items.length - 1]
    );
}

export async function spinGacha(
    userId: string,
    bannerId: string,
    count: 1 | 10,
    requestKey: string,
) {
    const result = await prisma.$transaction(async (tx) => {
        const existing = await tx.gachaDraw.findMany({
            where: { userId, requestKey },
            include: { prize: { include: { faunaEntry: true } } },
        });
        if (existing.length)
            return {
                duplicate: true,
                draws: existing.map((draw) => ({
                    ...draw,
                    isDuplicate: false,
                })),
                coins:
                    (await tx.wallet.findUnique({ where: { userId } }))
                        ?.coins ?? 0,
            };
        const banner = await tx.gachaBanner.findUnique({
            where: { id: bannerId },
            include: { prizes: { include: { faunaEntry: true } } },
        });
        if (
            !banner ||
            !banner.active ||
            !isActive(banner.startsAt, banner.endsAt)
        )
            throw new Error("BANNER_UNAVAILABLE");
        const wallet = await tx.wallet.upsert({
            where: { userId },
            create: { userId, coins: 0 },
            update: {},
        });
        await tx.$queryRaw<
            Array<{ id: string; coins: number }>
        >`SELECT "id", "coins" FROM "Wallet" WHERE "userId" = ${userId} FOR UPDATE`;
        const cost = count === 10 ? banner.tenSpinCost : banner.spinCost;
        if (wallet.coins < cost) throw new Error("INSUFFICIENT_COINS");
        const locked = await tx.$queryRaw<
            Array<{ id: string; stock: number }>
        >`SELECT "id", "stock" FROM "GachaPrize" WHERE "bannerId" = ${bannerId} AND "stock" > 0 FOR UPDATE`;
        const available = banner.prizes.filter(
            (prize) =>
                locked.some((row) => row.id === prize.id) && prize.stock > 0,
        );
        if (available.reduce((sum, item) => sum + item.stock, 0) < count)
            throw new Error("INSUFFICIENT_STOCK");
        const draws = [];
        for (let i = 0; i < count; i++) {
            const activeAvailable = available.filter((item) => item.stock > 0);
            const prize = pickWeighted(
                activeAvailable.map((item) => ({
                    ...item,
                    weight:
                        item.weight *
                        Math.max(1, rarityRank[item.rarity] === 1 ? 5 : 1),
                })),
            );
            const existingCollection = await tx.userCollection.findUnique({
                where: {
                    userId_faunaEntryId: {
                        userId,
                        faunaEntryId: prize.faunaEntryId,
                    },
                },
                select: { quantity: true },
            });
            await tx.gachaPrize.update({
                where: { id: prize.id },
                data: { stock: { decrement: 1 } },
            });
            const draw = await tx.gachaDraw.create({
                data: {
                    userId,
                    bannerId,
                    prizeId: prize.id,
                    requestKey,
                    drawIndex: i,
                    quantity: 1,
                    cost: count === 10 ? Math.ceil(cost / 10) : cost,
                },
                include: { prize: { include: { faunaEntry: true } } },
            });
            await tx.userCollection.upsert({
                where: {
                    userId_faunaEntryId: {
                        userId,
                        faunaEntryId: prize.faunaEntryId,
                    },
                },
                create: {
                    userId,
                    faunaEntryId: prize.faunaEntryId,
                    quantity: 1,
                },
                update: { quantity: { increment: 1 } },
            });
            await tx.collectionTransaction.create({
                data: {
                    userId,
                    faunaEntryId: prize.faunaEntryId,
                    type: CollectionTransactionType.WON,
                },
            });
            draws.push({
                ...draw,
                isDuplicate: Boolean(existingCollection?.quantity),
            });
            const index = available.findIndex((item) => item.id === prize.id);
            if (index >= 0 && available[index].stock > 0)
                available[index] = {
                    ...available[index],
                    stock: available[index].stock - 1,
                };
        }
        await tx.wallet.update({
            where: { userId },
            data: { coins: { decrement: cost } },
        });
        await tx.coinTransaction.create({
            data: {
                userId,
                type: CoinTransactionType.GACHA_SPIN,
                referenceId: requestKey,
                amount: -cost,
                description: `${count}x EcoKuji spin`,
            },
        });
        return { duplicate: false, draws, coins: wallet.coins - cost };
    });
    if (!result.duplicate) {
        await incrementMission(userId, MissionType.GACHA_SPIN);
        await incrementMission(
            userId,
            MissionType.COLLECTION_ADD,
            result.draws.length,
        );
    }
    return result;
}

export async function convertDuplicate(userId: string, faunaEntryId: string) {
    return prisma.$transaction(async (tx) => {
        const collection = await tx.userCollection.findUnique({
            where: { userId_faunaEntryId: { userId, faunaEntryId } },
        });
        if (!collection || collection.quantity < 2)
            throw new Error("NOT_ENOUGH_DUPLICATES");
        const fauna = await tx.faunaEntry.findUnique({
            where: { id: faunaEntryId },
            select: { rarity: true, name: true },
        });
        if (!fauna) throw new Error("FAUNA_NOT_FOUND");
        const coins = (
            { COMMON: 10, RARE: 25, EPIC: 60, LEGENDARY: 150 } as Record<
                PrizeRarity,
                number
            >
        )[fauna.rarity];
        await tx.userCollection.update({
            where: { userId_faunaEntryId: { userId, faunaEntryId } },
            data: { quantity: { decrement: 1 } },
        });
        await tx.wallet.upsert({
            where: { userId },
            create: { userId, coins },
            update: { coins: { increment: coins } },
        });
        await tx.coinTransaction.create({
            data: {
                userId,
                type: CoinTransactionType.DUPLICATE_CONVERSION,
                referenceId: `${faunaEntryId}-${Date.now()}`,
                amount: coins,
                description: `Converted duplicate ${fauna.name}`,
            },
        });
        await tx.collectionTransaction.create({
            data: {
                userId,
                faunaEntryId,
                type: CollectionTransactionType.CONVERTED,
                quantity: 1,
            },
        });
        return { coins };
    });
}

export async function redeemPromo(userId: string, rawCode: string) {
    return prisma.$transaction(async (tx) => {
        const code = await tx.promoCode.findUnique({
            where: { code: rawCode.trim().toUpperCase() },
        });
        if (!code || !code.active || !isActive(code.startsAt, code.endsAt))
            throw new Error("PROMO_INVALID");
        if (
            code.maxRedemptions !== null &&
            code.redemptionCount >= code.maxRedemptions
        )
            throw new Error("PROMO_EXHAUSTED");
        const existing = await tx.promoRedemption.findUnique({
            where: { userId_promoCodeId: { userId, promoCodeId: code.id } },
        });
        if (existing) throw new Error("PROMO_ALREADY_REDEEMED");
        await tx.promoRedemption.create({
            data: {
                userId,
                promoCodeId: code.id,
                rewardCoins: code.rewardCoins,
            },
        });
        await tx.promoCode.update({
            where: { id: code.id },
            data: { redemptionCount: { increment: 1 } },
        });
        await tx.wallet.upsert({
            where: { userId },
            create: { userId, coins: code.rewardCoins },
            update: { coins: { increment: code.rewardCoins } },
        });
        await tx.coinTransaction.create({
            data: {
                userId,
                type: CoinTransactionType.PROMO_REWARD,
                referenceId: code.id,
                amount: code.rewardCoins,
                description: `Promo code ${code.code}`,
            },
        });
        return { coins: code.rewardCoins };
    });
}

export async function claimMission(userId: string, missionId: string) {
    return prisma.$transaction(async (tx) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const mission = await tx.dailyMission.findUnique({
            where: { id: missionId },
        });
        if (!mission || !mission.active) throw new Error("MISSION_NOT_FOUND");
        const progress = await tx.userMissionProgress.findUnique({
            where: {
                userId_missionId_missionDate: {
                    userId,
                    missionId,
                    missionDate: today,
                },
            },
        });
        if (!progress || progress.progress < mission.target)
            throw new Error("MISSION_INCOMPLETE");
        if (progress.claimedAt) throw new Error("MISSION_ALREADY_CLAIMED");
        await tx.userMissionProgress.update({
            where: { id: progress.id },
            data: { claimedAt: new Date() },
        });
        await tx.wallet.upsert({
            where: { userId },
            create: { userId, coins: mission.rewardCoins },
            update: { coins: { increment: mission.rewardCoins } },
        });
        await tx.coinTransaction.create({
            data: {
                userId,
                type: CoinTransactionType.MISSION_REWARD,
                referenceId: `${missionId}-${today.toISOString()}`,
                amount: mission.rewardCoins,
                description: mission.title,
            },
        });
        return { coins: mission.rewardCoins };
    });
}

export async function incrementMission(
    userId: string,
    type: MissionType,
    amount = 1,
) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const missions = await prisma.dailyMission.findMany({
        where: { active: true, type },
    });
    for (const mission of missions)
        await prisma.userMissionProgress.upsert({
            where: {
                userId_missionId_missionDate: {
                    userId,
                    missionId: mission.id,
                    missionDate: today,
                },
            },
            create: {
                userId,
                missionId: mission.id,
                missionDate: today,
                progress: Math.min(amount, mission.target),
            },
            update: { progress: { increment: amount } },
        });
}
