import { NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../../../lib/server-auth";
import { convertDuplicate } from "../../../../lib/gamification";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";
const schema = z.object({ faunaEntryId: z.string().min(1) });
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Sign in to manage your collection.",
                401,
            );
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success)
            return errorResponse(
                "VALIDATION_ERROR",
                "Invalid collection request.",
                400,
            );
        return dataResponse(
            await convertDuplicate(user.id, parsed.data.faunaEntryId),
        );
    } catch (error) {
        if (
            error instanceof Error &&
            ["NOT_ENOUGH_DUPLICATES", "FAUNA_NOT_FOUND"].includes(error.message)
        )
            return errorResponse(
                error.message,
                "You do not have enough duplicates to convert.",
                409,
            );
        return handleRouteError(error);
    }
}
