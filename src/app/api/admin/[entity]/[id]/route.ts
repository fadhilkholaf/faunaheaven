import { NextRequest } from "next/server";
import { requireAdmin } from "../../../../../lib/server-auth";
import { prisma } from "../../../../../lib/prisma";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../../lib/api";
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ entity: string; id: string }> },
) {
    try {
        const user = await requireAdmin();
        const { entity, id } = await params;
        let deleted: unknown;
        if (entity === "faqs")
            deleted = await prisma.fAQ.delete({ where: { id } });
        else if (entity === "promos")
            deleted = await prisma.promoCode.delete({ where: { id } });
        else if (entity === "faunadex")
            deleted = await prisma.faunaEntry.delete({ where: { id } });
        else
            return errorResponse(
                "UNSUPPORTED",
                "This resource cannot be deleted from this endpoint.",
                400,
            );
        await prisma.adminAuditLog.create({
            data: { userId: user.id, action: "DELETE", entity, entityId: id },
        });
        return dataResponse(deleted);
    } catch (error) {
        return handleRouteError(error);
    }
}
