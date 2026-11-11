import { NextResponse } from "next/server";
import type { ApiError } from "./validation";

export function dataResponse<T>(data: T, status = 200) {
    return NextResponse.json({ data }, { status });
}

export function errorResponse(
    code: string,
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
) {
    const body: ApiError = {
        error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) },
    };
    return NextResponse.json(body, { status });
}

export function handleRouteError(error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED")
        return errorResponse(
            "UNAUTHORIZED",
            "Please sign in to continue.",
            401,
        );
    if (error instanceof Error && error.message === "FORBIDDEN")
        return errorResponse(
            "FORBIDDEN",
            "You do not have permission to do that.",
            403,
        );
    console.error(error);
    return errorResponse(
        "INTERNAL_ERROR",
        "Something went wrong. Please try again.",
        500,
    );
}
