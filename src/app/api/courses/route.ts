import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/server-auth";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../lib/api";
import { enrollmentSchema, validationError } from "../../../lib/validation";
import { enrollInCourse } from "../../../lib/learning";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return errorResponse(
                "UNAUTHORIZED",
                "Please sign in to enroll.",
                401,
            );
        const parsed = enrollmentSchema.safeParse(await request.json());
        if (!parsed.success)
            return errorResponse(
                validationError(parsed.error).error.code,
                validationError(parsed.error).error.message,
                400,
                validationError(parsed.error).error.fieldErrors,
            );
        const enrollment = await enrollInCourse(
            prisma,
            user.id,
            parsed.data.courseId,
        );
        return dataResponse(
            { id: enrollment.id, enrolledAt: enrollment.enrolledAt },
            201,
        );
    } catch (error) {
        if (error instanceof Error && error.message === "COURSE_NOT_FOUND")
            return errorResponse(
                "COURSE_NOT_FOUND",
                "That course could not be found.",
                404,
            );
        return handleRouteError(error);
    }
}
