-- CreateEnum
CREATE TYPE "PrizeRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('COURSE_MODULE', 'QUIZ_COMPLETE', 'GACHA_SPIN', 'COLLECTION_ADD');

-- CreateEnum
CREATE TYPE "CollectionTransactionType" AS ENUM ('WON', 'GIFT_SENT', 'GIFT_RECEIVED', 'CONVERTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CoinTransactionType" ADD VALUE 'GACHA_SPIN';
ALTER TYPE "CoinTransactionType" ADD VALUE 'DUPLICATE_CONVERSION';
ALTER TYPE "CoinTransactionType" ADD VALUE 'MISSION_REWARD';
ALTER TYPE "CoinTransactionType" ADD VALUE 'PROMO_REWARD';

-- CreateTable
CREATE TABLE "GachaBanner" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "spinCost" INTEGER NOT NULL,
    "tenSpinCost" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GachaBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GachaPrize" (
    "id" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "faunaEntryId" TEXT NOT NULL,
    "rarity" "PrizeRarity" NOT NULL,
    "stock" INTEGER NOT NULL,
    "initialStock" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GachaPrize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GachaDraw" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "requestKey" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GachaDraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaunaEntry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "habitat" TEXT NOT NULL,
    "rarity" "PrizeRarity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FaunaEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "faunaEntryId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "firstCollectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "faunaEntryId" TEXT NOT NULL,
    "type" "CollectionTransactionType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "targetUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MissionType" NOT NULL,
    "target" INTEGER NOT NULL,
    "rewardCoins" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMissionProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "missionDate" DATE NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "claimedAt" TIMESTAMP(3),

    CONSTRAINT "UserMissionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rewardCoins" INTEGER NOT NULL,
    "maxRedemptions" INTEGER,
    "redemptionCount" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoRedemption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promoCodeId" TEXT NOT NULL,
    "rewardCoins" INTEGER NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GachaBanner_slug_key" ON "GachaBanner"("slug");

-- CreateIndex
CREATE INDEX "GachaBanner_category_active_idx" ON "GachaBanner"("category", "active");

-- CreateIndex
CREATE INDEX "GachaPrize_bannerId_stock_idx" ON "GachaPrize"("bannerId", "stock");

-- CreateIndex
CREATE UNIQUE INDEX "GachaPrize_bannerId_faunaEntryId_key" ON "GachaPrize"("bannerId", "faunaEntryId");

-- CreateIndex
CREATE INDEX "GachaDraw_userId_createdAt_idx" ON "GachaDraw"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GachaDraw_userId_requestKey_prizeId_key" ON "GachaDraw"("userId", "requestKey", "prizeId");

-- CreateIndex
CREATE UNIQUE INDEX "FaunaEntry_slug_key" ON "FaunaEntry"("slug");

-- CreateIndex
CREATE INDEX "FaunaEntry_rarity_createdAt_idx" ON "FaunaEntry"("rarity", "createdAt");

-- CreateIndex
CREATE INDEX "UserCollection_userId_updatedAt_idx" ON "UserCollection"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollection_userId_faunaEntryId_key" ON "UserCollection"("userId", "faunaEntryId");

-- CreateIndex
CREATE INDEX "CollectionTransaction_userId_createdAt_idx" ON "CollectionTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserMissionProgress_userId_missionDate_idx" ON "UserMissionProgress"("userId", "missionDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserMissionProgress_userId_missionId_missionDate_key" ON "UserMissionProgress"("userId", "missionId", "missionDate");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PromoRedemption_userId_promoCodeId_key" ON "PromoRedemption"("userId", "promoCodeId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entity_entityId_createdAt_idx" ON "AdminAuditLog"("entity", "entityId", "createdAt");

-- AddForeignKey
ALTER TABLE "GachaPrize" ADD CONSTRAINT "GachaPrize_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "GachaBanner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaPrize" ADD CONSTRAINT "GachaPrize_faunaEntryId_fkey" FOREIGN KEY ("faunaEntryId") REFERENCES "FaunaEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaDraw" ADD CONSTRAINT "GachaDraw_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaDraw" ADD CONSTRAINT "GachaDraw_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "GachaBanner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GachaDraw" ADD CONSTRAINT "GachaDraw_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "GachaPrize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_faunaEntryId_fkey" FOREIGN KEY ("faunaEntryId") REFERENCES "FaunaEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTransaction" ADD CONSTRAINT "CollectionTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTransaction" ADD CONSTRAINT "CollectionTransaction_faunaEntryId_fkey" FOREIGN KEY ("faunaEntryId") REFERENCES "FaunaEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMissionProgress" ADD CONSTRAINT "UserMissionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMissionProgress" ADD CONSTRAINT "UserMissionProgress_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "DailyMission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoRedemption" ADD CONSTRAINT "PromoRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoRedemption" ADD CONSTRAINT "PromoRedemption_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
