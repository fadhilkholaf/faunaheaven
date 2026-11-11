import { z } from "zod";

export const enrollmentSchema = z.object({ courseId: z.string().min(1) });
export const moduleCompletionSchema = z.object({
    courseId: z.string().min(1),
    moduleId: z.string().min(1),
});
export const quizSubmissionSchema = z.object({
    journalId: z.string().min(1),
    attemptKey: z.string().min(8).max(100),
    answers: z.record(z.string(), z.number().int().min(0).max(20)),
});
export const profileSchema = z.object({
    displayName: z.string().trim().min(2).max(60),
    bio: z.string().trim().max(240),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ApiError = {
    error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
    };
};

export function validationError(error: z.ZodError): ApiError {
    return {
        error: {
            code: "VALIDATION_ERROR",
            message: "Please check the highlighted fields.",
            fieldErrors: error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        },
    };
}
