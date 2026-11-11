import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/server-auth";
import {
    dataResponse,
    errorResponse,
    handleRouteError,
} from "../../../../lib/api";

const createSchema = z.object({
    name: z.string().min(2).optional(),
    title: z.string().min(2).optional(),
    question: z.string().min(2).optional(),
    answer: z.string().min(2).optional(),
    code: z.string().min(3).optional(),
    rewardCoins: z.number().int().nonnegative().optional(),
    description: z.string().optional(),
    slug: z.string().min(2).optional(),
    category: z.string().optional(),
});

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ entity: string }> },
) {
    try {
        await requireAdmin();
        const { entity } = await params;
        const data =
            entity === "users"
                ? await prisma.user.findMany({
                      select: {
                          id: true,
                          name: true,
                          email: true,
                          role: true,
                          createdAt: true,
                      },
                      orderBy: { createdAt: "desc" },
                  })
                : entity === "courses"
                  ? await prisma.course.findMany({
                        include: { category: true },
                        orderBy: { createdAt: "desc" },
                    })
                  : entity === "journal"
                    ? await prisma.journal.findMany({
                          orderBy: { createdAt: "desc" },
                      })
                    : entity === "faqs"
                      ? await prisma.fAQ.findMany({
                            orderBy: { position: "asc" },
                        })
                      : entity === "ecokuji"
                        ? await prisma.gachaBanner.findMany({
                              include: { prizes: true },
                              orderBy: { createdAt: "desc" },
                          })
                        : entity === "faunadex"
                          ? await prisma.faunaEntry.findMany({
                                orderBy: { createdAt: "desc" },
                            })
                          : entity === "missions"
                            ? await prisma.dailyMission.findMany({
                                  orderBy: { createdAt: "desc" },
                              })
                            : entity === "promos"
                              ? await prisma.promoCode.findMany({
                                    orderBy: { createdAt: "desc" },
                                })
                              : null;
        if (!data)
            return errorResponse("NOT_FOUND", "Admin resource not found.", 404);
        return dataResponse(data);
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ entity: string }> },
) {
    try {
        const user = await requireAdmin();
        const { entity } = await params;
        const parsed = createSchema.safeParse(await request.json());
        if (!parsed.success)
            return errorResponse(
                "VALIDATION_ERROR",
                "Invalid admin data.",
                400,
            );
        const input = parsed.data;
        let created: unknown;
        if (entity === "faqs")
            created = await prisma.fAQ.create({
                data: {
                    category: input.category ?? "General",
                    question: input.question ?? input.title ?? "",
                    answer: input.answer ?? input.description ?? "",
                },
            });
        else if (entity === "promos")
            created = await prisma.promoCode.create({
                data: {
                    code: input.code?.toUpperCase() ?? "",
                    rewardCoins: input.rewardCoins ?? 0,
                },
            });
        else if (entity === "faunadex")
            created = await prisma.faunaEntry.create({
                data: {
                    slug:
                        input.slug ??
                        input.name?.toLowerCase().replaceAll(" ", "-") ??
                        "entry",
                    name: input.name ?? input.title ?? "Wildlife entry",
                    scientificName: "To be added",
                    description: input.description ?? "",
                    imageUrl:
                        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=85",
                    habitat: "To be added",
                    rarity: "COMMON",
                },
            });
        else
            return errorResponse(
                "UNSUPPORTED",
                "Use the dedicated admin editor for this resource.",
                400,
            );
        await prisma.adminAuditLog.create({
            data: {
                userId: user.id,
                action: "CREATE",
                entity,
                entityId: (created as { id: string }).id,
            },
        });
        return dataResponse(created, 201);
    } catch (error) {
        return handleRouteError(error);
    }
}
