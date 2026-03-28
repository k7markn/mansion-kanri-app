import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { InquiryCategory } from "@/generated/prisma";

const createSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  content: z.string().min(1, "内容は必須です"),
  category: z.enum(["EQUIPMENT", "NOISE", "COMMON_AREA", "OTHER"]),
  isAnonymous: z.boolean().default(false),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { id: user.id } });
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 住民は自分の問い合わせのみ、理事以上は全件
    const where = profile.role === "RESIDENT" ? { submitterId: user.id } : {};

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        submitter: { select: { fullName: true, unit: { include: { building: true } } } },
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json(inquiries);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const result = createSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        ...result.data,
        category: result.data.category as InquiryCategory,
        submitterId: result.data.isAnonymous ? null : user.id,
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
