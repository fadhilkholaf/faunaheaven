-- Allow the same prize to appear more than once in a single 10x pull.
ALTER TABLE "GachaDraw" ADD COLUMN "drawIndex" INTEGER NOT NULL DEFAULT 0;

DROP INDEX "GachaDraw_userId_requestKey_prizeId_key";

CREATE UNIQUE INDEX "GachaDraw_userId_requestKey_drawIndex_key"
ON "GachaDraw"("userId", "requestKey", "drawIndex");
