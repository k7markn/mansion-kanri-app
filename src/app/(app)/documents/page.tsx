import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DocumentsClient from "./DocumentsClient";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/login");

  const visibilityIn =
    profile.role === "RESIDENT"
      ? ["ALL_RESIDENTS" as const]
      : profile.role === "BOARD"
      ? ["ALL_RESIDENTS" as const, "BOARD_ONLY" as const]
      : undefined;

  const documents = await prisma.document.findMany({
    where: visibilityIn ? { visibility: { in: visibilityIn } } : undefined,
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: { select: { fullName: true } } },
  });

  return (
    <DocumentsClient
      documents={JSON.parse(JSON.stringify(documents))}
      userRole={profile.role}
    />
  );
}
