import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { AnnouncementCategory, AnnouncementPriority } from "@/generated/prisma";

const createSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  content: z.string().min(1, "本文は必須です"),
  category: z.enum(["BOARD", "CONSTRUCTION", "EMERGENCY", "GENERAL", "BULLETIN"]),
  priority: z.enum(["NORMAL", "IMPORTANT", "URGENT"]).default("NORMAL"),
  publishedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { fullName: true } },
        reads: { where: { userId: user.id }, select: { readAt: true } },
        _count: { select: { reads: true } },
      },
    });

    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { id: user.id } });
    if (!profile || profile.role === "RESIDENT") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const body = await req.json();
    const result = createSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { publishedAt, expiresAt, ...rest } = result.data;
    const announcement = await prisma.announcement.create({
      data: {
        ...rest,
        category: rest.category as AnnouncementCategory,
        priority: rest.priority as AnnouncementPriority,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        authorId: user.id,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
