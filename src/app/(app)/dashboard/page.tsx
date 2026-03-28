import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import {
  Building2, Users, MessageSquare, ChevronRight,
  Bell, AlertCircle,
} from "lucide-react";

function StatCard({
  icon: Icon, label, value, sub, color, alert,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  alert?: boolean;
}) {
  return (
    <div className={cn("bg-white rounded-xl border p-5 flex items-start gap-4", alert ? "border-red-200" : "border-gray-200")}>
      <div className={cn("p-2.5 rounded-lg", color)}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={cn("text-2xl font-bold", alert ? "text-red-600" : "text-gray-900")}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  URGENT: { label: "緊急", color: "bg-red-100 text-red-700" },
  IMPORTANT: { label: "重要", color: "bg-orange-100 text-orange-700" },
  NORMAL: { label: "通常", color: "bg-gray-100 text-gray-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: "受付済", color: "bg-red-100 text-red-600" },
  IN_PROGRESS: { label: "対応中", color: "bg-yellow-100 text-yellow-700" },
  COMPLETED: { label: "完了", color: "bg-green-100 text-green-700" },
  ON_HOLD: { label: "保留", color: "bg-gray-100 text-gray-600" },
};

function formatDate(str: string | Date | null) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { unit: { include: { building: true } } },
  });
  if (!profile) redirect("/login");

  const isBoard = profile.role !== "RESIDENT";

  const [
    totalUnits,
    occupiedUnits,
    recentAnnouncements,
    openInquiries,
    unreadCount,
  ] = await Promise.all([
    prisma.unit.count(),
    prisma.unit.count({ where: { residents: { some: {} } } }),
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: { select: { fullName: true } } },
    }),
    prisma.inquiry.findMany({
      where: { status: { in: ["RECEIVED", "IN_PROGRESS"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.announcementRead.count({
      where: {
        userId: { not: user.id },
        announcement: { authorId: user.id },
      },
    }),
  ]);

  const totalResidents = await prisma.profile.count({ where: { role: "RESIDENT" } });

  return (
    <div>
      <Header
        title="ダッシュボード"
        subtitle={`ようこそ、${profile.fullName}さん${profile.position ? `（${profile.position}）` : ""}`}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Building2} label="総住戸数 / 入居中" color="bg-blue-50 text-blue-600"
            value={`${totalUnits}戸`} sub={`入居中: ${occupiedUnits}戸`}
          />
          <StatCard
            icon={Users} label="登録住民数" color="bg-green-50 text-green-600"
            value={`${totalResidents}名`}
          />
          <StatCard
            icon={MessageSquare} label="未対応問い合わせ" color="bg-orange-50 text-orange-500"
            value={`${openInquiries.length}件`} sub="確認が必要"
            alert={openInquiries.length > 0}
          />
          <StatCard
            icon={Bell} label="最新お知らせ" color="bg-indigo-50 text-indigo-600"
            value={`${recentAnnouncements.length}件`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Announcements */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-blue-600" />
                <h2 className="font-semibold text-gray-900">最新のお知らせ</h2>
              </div>
              <Link href="/announcements" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                すべて見る <ChevronRight size={12} />
              </Link>
            </div>
            {recentAnnouncements.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">お知らせはありません</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentAnnouncements.map((a) => {
                  const p = priorityConfig[a.priority] ?? priorityConfig.NORMAL;
                  return (
                    <div key={a.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 flex-shrink-0", p.color)}>
                          {p.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(a.publishedAt ?? a.createdAt)} · {a.author.fullName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Open Inquiries */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-orange-500" />
                <h2 className="font-semibold text-gray-900">未対応問い合わせ</h2>
              </div>
              <Link href="/inquiries" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                すべて <ChevronRight size={12} />
              </Link>
            </div>
            {openInquiries.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">未対応はありません</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {openInquiries.map((inq) => {
                  const st = statusConfig[inq.status] ?? statusConfig.RECEIVED;
                  return (
                    <div key={inq.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium text-gray-900 truncate">{inq.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn("text-xs px-1.5 py-0.5 rounded", st.color)}>{st.label}</span>
                        <span className="text-xs text-gray-500">{formatDate(inq.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Alert for open inquiries (board users) */}
        {isBoard && openInquiries.filter((i) => i.status === "RECEIVED").length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">未対応の問い合わせがあります</p>
              <p className="text-sm text-amber-700 mt-0.5">
                {openInquiries.filter((i) => i.status === "RECEIVED").length}件の問い合わせが未対応です。
                <Link href="/inquiries" className="underline ml-1">問い合わせ管理で確認する</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
