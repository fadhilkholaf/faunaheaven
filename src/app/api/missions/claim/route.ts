import { NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../../../lib/server-auth";
import { claimMission } from "../../../../lib/gamification";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";
const schema = z.object({ missionId: z.string().min(1) });
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Sign in to claim missions.",
                401,
            );
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success)
            return errorResponse(
                "VALIDATION_ERROR",
                "Invalid mission request.",
                400,
            );
        return dataResponse(await claimMission(user.id, parsed.data.missionId));
    } catch (error) {
        if (
            error instanceof Error &&
            [
                "MISSION_NOT_FOUND",
                "MISSION_INCOMPLETE",
                "MISSION_ALREADY_CLAIMED",
            ].includes(error.message)
        )
            return errorResponse(
                error.message,
                "This mission is not ready to claim.",
                409,
            );
        return handleRouteError(error);
    }
}
