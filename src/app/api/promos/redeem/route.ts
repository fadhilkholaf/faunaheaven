import { NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../../../lib/server-auth";
import { redeemPromo } from "../../../../lib/gamification";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";
import { rateLimit } from "../../../../lib/rate-limit";
const schema = z.object({ code: z.string().trim().min(3).max(32) });
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Sign in to redeem promo codes.",
                401,
            );
        if (!rateLimit(`promo:${user.id}`, 5))
            return errorResponse(
                "RATE_LIMITED",
                "Too many promo attempts. Please wait.",
                429,
            );
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success)
            return errorResponse(
                "VALIDATION_ERROR",
                "Enter a valid promo code.",
                400,
            );
        return dataResponse(await redeemPromo(user.id, parsed.data.code));
    } catch (error) {
        if (
            error instanceof Error &&
            [
                "PROMO_INVALID",
                "PROMO_EXHAUSTED",
                "PROMO_ALREADY_REDEEMED",
            ].includes(error.message)
        )
            return errorResponse(
                error.message,
                "This promo code cannot be redeemed.",
                409,
            );
        return handleRouteError(error);
    }
}
