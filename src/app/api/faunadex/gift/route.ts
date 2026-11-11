import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/server-auth";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";
import { CollectionTransactionType } from "../../../../../generated/prisma/enums";
const schema = z.object({
    faunaEntryId: z.string().min(1),
    recipientUserId: z.string().min(1),
});
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse("UNAUTHORIZED", "Sign in to gift cards.", 401);
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success)
            return errorResponse(
                "VALIDATION_ERROR",
                "Invalid gift request.",
                400,
            );
        if (parsed.data.recipientUserId === user.id)
            return errorResponse(
                "INVALID_RECIPIENT",
                "Choose another FaunaHeaven member.",
                400,
            );
        const result = await prisma.$transaction(async (tx) => {
            const collection = await tx.userCollection.findUnique({
                where: {
                    userId_faunaEntryId: {
                        userId: user.id,
                        faunaEntryId: parsed.data.faunaEntryId,
                    },
                },
            });
            if (!collection || collection.quantity < 2)
                throw new Error("NOT_ENOUGH_DUPLICATES");
            const recipient = await tx.user.findUnique({
                where: { id: parsed.data.recipientUserId },
                select: { id: true },
            });
            if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");
            await tx.userCollection.update({
                where: {
                    userId_faunaEntryId: {
                        userId: user.id,
                        faunaEntryId: parsed.data.faunaEntryId,
                    },
                },
                data: { quantity: { decrement: 1 } },
            });
            await tx.userCollection.upsert({
                where: {
                    userId_faunaEntryId: {
                        userId: recipient.id,
                        faunaEntryId: parsed.data.faunaEntryId,
                    },
                },
                create: {
                    userId: recipient.id,
                    faunaEntryId: parsed.data.faunaEntryId,
                    quantity: 1,
                },
                update: { quantity: { increment: 1 } },
            });
            await tx.collectionTransaction.createMany({
                data: [
                    {
                        userId: user.id,
                        faunaEntryId: parsed.data.faunaEntryId,
                        type: CollectionTransactionType.GIFT_SENT,
                        targetUserId: recipient.id,
                    },
                    {
                        userId: recipient.id,
                        faunaEntryId: parsed.data.faunaEntryId,
                        type: CollectionTransactionType.GIFT_RECEIVED,
                        targetUserId: user.id,
                    },
                ],
            });
            return { gifted: true };
        });
        return dataResponse(result);
    } catch (error) {
        if (
            error instanceof Error &&
            ["NOT_ENOUGH_DUPLICATES", "RECIPIENT_NOT_FOUND"].includes(
                error.message,
            )
        )
            return errorResponse(
                error.message,
                "The gift could not be completed.",
                409,
            );
        return handleRouteError(error);
    }
}
