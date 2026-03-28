import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  buildingId: z.string().optional(),
  roomNumber: z.string().min(1, "部屋番号は必須です"),
  floor: z.number().int().optional(),
  area: z.number().positive().optional(),
  ownershipRatio: z.number().positive().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { id: user.id } });
    if (!profile || profile.role === "RESIDENT") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const units = await prisma.unit.findMany({
      orderBy: [{ buildingId: "asc" }, { roomNumber: "asc" }],
      include: {
        building: true,
        residents: {
          select: { id: true, fullName: true, role: true, position: true },
        },
      },
    });

    return NextResponse.json(units);
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
    if (!profile || !["MANAGEMENT", "ADMIN"].includes(profile.role)) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const body = await req.json();
    const result = createSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const unit = await prisma.unit.create({ data: result.data });
    return NextResponse.json(unit, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
