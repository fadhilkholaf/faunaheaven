import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/server-auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    const user = await getCurrentUser();
    if (!user)
        return NextResponse.json(
            { error: { code: "UNAUTHORIZED", message: "Sign in required." } },
            { status: 401 },
        );
    const wallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
        select: { coins: true },
    });
    return NextResponse.json({ data: { coins: wallet?.coins ?? 0 } });
}
