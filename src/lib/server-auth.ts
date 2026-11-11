import { headers } from "next/headers";
import { auth } from "./auth";

export async function getCurrentUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
}

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) throw new Error("UNAUTHORIZED");
    return user;
}

export async function requireAdmin() {
    const user = await requireUser();
    const databaseUser = await (
        await import("./prisma")
    ).prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
    });
    if (databaseUser?.role !== "ADMIN") throw new Error("FORBIDDEN");
    return user;
}
