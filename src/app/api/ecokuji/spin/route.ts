import { NextRequest } from "next/server";
import { getCurrentUser } from "../../../../lib/server-auth";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";
import { spinGacha } from "../../../../lib/gamification";
import { rateLimit } from "../../../../lib/rate-limit";
import { z } from "zod";
const schema = z.object({
    bannerId: z.string().min(1),
    count: z.union([z.literal(1), z.literal(10)]),
    requestKey: z.string().min(8).max(100),
});
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Sign in to spin EcoKuji.",
                401,
            );
        if (!rateLimit(`gacha:${user.id}`, 12))
            return errorResponse(
                "RATE_LIMITED",
                "Too many spins. Please wait a moment.",
                429,
            );
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success)
            return errorResponse(
                "VALIDATION_ERROR",
                "Invalid spin request.",
                400,
            );
        try {
            return dataResponse(
                await spinGacha(
                    user.id,
                    parsed.data.bannerId,
                    parsed.data.count,
                    parsed.data.requestKey,
                ),
            );
        } catch (error) {
            if (
                error instanceof Error &&
                [
                    "BANNER_UNAVAILABLE",
                    "INSUFFICIENT_COINS",
                    "INSUFFICIENT_STOCK",
                ].includes(error.message)
            )
                return errorResponse(
                    error.message,
                    error.message === "INSUFFICIENT_COINS"
                        ? "You need more coins for this spin."
                        : "This banner is not available.",
                    409,
                );
            throw error;
        }
    } catch (error) {
        return handleRouteError(error);
    }
}
