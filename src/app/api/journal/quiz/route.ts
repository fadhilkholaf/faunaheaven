import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/server-auth";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";
import {
    quizSubmissionSchema,
    validationError,
} from "../../../../lib/validation";
import { submitQuiz } from "../../../../lib/learning";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Sign in to take quizzes and earn coins.",
                401,
            );
        const parsed = quizSubmissionSchema.safeParse(await request.json());
        if (!parsed.success) {
            const e = validationError(parsed.error).error;
            return errorResponse(e.code, e.message, 400, e.fieldErrors);
        }
        return dataResponse(
            await submitQuiz(
                prisma,
                user.id,
                parsed.data.journalId,
                parsed.data.attemptKey,
                parsed.data.answers,
            ),
        );
    } catch (error) {
        if (error instanceof Error && error.message === "JOURNAL_NOT_FOUND")
            return errorResponse(
                "JOURNAL_NOT_FOUND",
                "That journal quiz could not be found.",
                404,
            );
        return handleRouteError(error);
    }
}
