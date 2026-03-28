import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import type { UserRole } from "@/generated/prisma";

export type ProfileForLayout = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  position: string | null;
  unit: { roomNumber: string; building: { name: string } | null } | null;
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { unit: { include: { building: true } } },
  });

  if (!profile) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
