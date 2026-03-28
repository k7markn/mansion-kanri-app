import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UnitsClient from "./UnitsClient";

export default async function UnitsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || profile.role === "RESIDENT") redirect("/dashboard");

  const [units, buildings] = await Promise.all([
    prisma.unit.findMany({
      orderBy: [{ buildingId: "asc" }, { roomNumber: "asc" }],
      include: {
        building: true,
        residents: { select: { id: true, fullName: true, role: true, position: true, email: true } },
      },
    }),
    prisma.building.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <UnitsClient
      units={JSON.parse(JSON.stringify(units))}
      buildings={JSON.parse(JSON.stringify(buildings))}
      userRole={profile.role}
    />
  );
}
