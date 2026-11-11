import { getCurrentUser } from "../../../../lib/server-auth";
import { claimDailyReward } from "../../../../lib/gamification";
import { dataResponse, errorResponse, handleRouteError } from "../../../../lib/api";

export async function POST() {
    try {
        const user = await getCurrentUser();
        if (!user) return errorResponse("UNAUTHORIZED", "Silakan masuk untuk mengambil hadiah harian.", 401);
        return dataResponse(await claimDailyReward(user.id));
    } catch (error) {
        return handleRouteError(error);
    }
}
