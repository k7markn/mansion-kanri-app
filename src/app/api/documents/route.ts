import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { DocumentCategory, DocumentVisibility } from "@/generated/prisma";

const createSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  category: z.enum(["RULES", "BYLAWS", "MINUTES", "MEETING_DOCS", "CONTRACTS", "DRAWINGS", "OTHER"]),
  fileUrl: z.string().url("ファイルURLが不正です"),
  fileName: z.string().min(1),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  visibility: z.enum(["ALL_RESIDENTS", "BOARD_ONLY", "MANAGEMENT_ONLY"]).default("ALL_RESIDENTS"),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { id: user.id } });
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 権限に応じた公開範囲フィルタ
    const visibilityFilter =
      profile.role === "RESIDENT"
        ? { visibility: "ALL_RESIDENTS" as DocumentVisibility }
        : profile.role === "BOARD"
        ? { visibility: { in: ["ALL_RESIDENTS", "BOARD_ONLY"] as DocumentVisibility[] } }
        : {};

    const documents = await prisma.document.findMany({
      where: visibilityFilter,
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { fullName: true } } },
    });

    return NextResponse.json(documents);
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

    const document = await prisma.document.create({
      data: {
        ...result.data,
        category: result.data.category as DocumentCategory,
        visibility: result.data.visibility as DocumentVisibility,
        uploadedById: user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
