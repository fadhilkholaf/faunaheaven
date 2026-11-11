import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/server-auth";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../lib/api";
import { profileSchema, validationError } from "../../../lib/validation";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return errorResponse("UNAUTHORIZED", "Please sign in.", 401);
    const profile = await prisma.userProfile.findUnique({
        where: { userId: user.id },
        select: { displayName: true, bio: true },
    });
    return dataResponse({
        displayName: profile?.displayName ?? user.name,
        bio: profile?.bio ?? "",
    });
}

export async function PATCH(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Please sign in to edit your profile.",
                401,
            );
        const parsed = profileSchema.safeParse(await request.json());
        if (!parsed.success) {
            const e = validationError(parsed.error).error;
            return errorResponse(e.code, e.message, 400, e.fieldErrors);
        }
        const profile = await prisma.userProfile.upsert({
            where: { userId: user.id },
            create: { userId: user.id, ...parsed.data },
            update: parsed.data,
        });
        return dataResponse(profile);
    } catch (error) {
        return handleRouteError(error);
    }
}
