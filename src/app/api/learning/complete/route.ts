import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/server-auth";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";
import {
    moduleCompletionSchema,
    validationError,
} from "../../../../lib/validation";
import { completeModule } from "../../../../lib/learning";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Please sign in to continue.",
                401,
            );
        const parsed = moduleCompletionSchema.safeParse(await request.json());
        if (!parsed.success) {
            const e = validationError(parsed.error).error;
            return errorResponse(e.code, e.message, 400, e.fieldErrors);
        }
        return dataResponse(
            await completeModule(
                prisma,
                user.id,
                parsed.data.courseId,
                parsed.data.moduleId,
            ),
        );
    } catch (error) {
        if (error instanceof Error && error.message === "NOT_ENROLLED")
            return errorResponse(
                "NOT_ENROLLED",
                "Enroll in this course before completing modules.",
                403,
            );
        return handleRouteError(error);
    }
}
