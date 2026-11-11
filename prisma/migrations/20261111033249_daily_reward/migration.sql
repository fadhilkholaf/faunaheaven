-- AlterEnum
ALTER TYPE "CoinTransactionType" ADD VALUE 'DAILY_REWARD';

-- AlterTable
ALTER TABLE "GachaDraw" ALTER COLUMN "drawIndex" DROP DEFAULT;
