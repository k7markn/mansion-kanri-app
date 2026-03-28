import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/login");

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { fullName: true } },
      reads: { where: { userId: user.id }, select: { readAt: true } },
      _count: { select: { reads: true } },
    },
  });

  return (
    <AnnouncementsClient
      announcements={JSON.parse(JSON.stringify(announcements))}
      userRole={profile.role}
    />
  );
}
