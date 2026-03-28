import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InquiriesClient from "./InquiriesClient";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/login");

  const where = profile.role === "RESIDENT" ? { submitterId: user.id } : {};

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      submitter: { select: { fullName: true, unit: { include: { building: true } } } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <InquiriesClient
      inquiries={JSON.parse(JSON.stringify(inquiries))}
      userRole={profile.role}
    />
  );
}
