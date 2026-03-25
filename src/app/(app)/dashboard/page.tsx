import Header from "@/components/Header";
import {
  Building2, Users, Wallet, AlertTriangle, CalendarDays,
  MessageSquare, TrendingUp, ChevronRight, Bell, Wrench,
} from "lucide-react";
import { dashboardStats, mockAnnouncements, mockMeetings, mockInquiries } from "@/data/mock";
import { currentUser } from "@/data/mock";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const priorityConfig = {
  urgent: { label: "緊急", color: "bg-red-100 text-red-700" },
  important: { label: "重要", color: "bg-orange-100 text-orange-700" },
  normal: { label: "通常", color: "bg-gray-100 text-gray-600" },
};

const meetingTypeLabels: Record<string, string> = {
  annual_general: "定期総会",
  extraordinary_general: "臨時総会",
  board: "理事会",
  extraordinary_board: "臨時理事会",
};

export default function DashboardPage() {
  const user = currentUser;
  const isBoard = user.role === "board" || user.role === "management";

  const upcomingMeetings = mockMeetings
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));

  const recentAnnouncements = mockAnnouncements
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);

  const openInquiries = mockInquiries.filter((i) => i.status === "open" || i.status === "in_progress");

  return (
    <div>
      <Header
        title="ダッシュボード"
        subtitle={`ようこそ、${user.name}さん（${user.position ?? ""}）`}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Building2} label="総戸数 / 入居戸数" color="bg-blue-50 text-blue-600"
            value={`${dashboardStats.totalUnits}戸`} sub={`入居中: ${dashboardStats.occupiedUnits}戸`}
          />
          {isBoard ? (
            <>
              <StatCard
                icon={Wallet} label="修繕積立金残高" color="bg-green-50 text-green-600"
                value={`¥${(dashboardStats.repairReserveBalance / 10000).toFixed(0)}万`}
                sub="2026年3月末時点"
              />
              <StatCard
                icon={TrendingUp} label="管理費収納率" color="bg-indigo-50 text-indigo-600"
                value={`${dashboardStats.managementFeeCollectionRate}%`} sub="2026年3月度"
              />
              <StatCard
                icon={AlertTriangle} label="未収金住戸数" color="bg-red-50 text-red-500"
                value={`${dashboardStats.overduePayments}戸`} sub="督促対応中" alert
              />
            </>
          ) : (
            <>
              <StatCard
                icon={CalendarDays} label="直近の会議" color="bg-green-50 text-green-600"
                value={`${dashboardStats.upcomingMeetings}件`} sub="予定あり"
              />
              <StatCard
                icon={MessageSquare} label="未対応問い合わせ" color="bg-orange-50 text-orange-500"
                value={`${dashboardStats.openInquiries}件`} sub="確認が必要"
              />
              <StatCard
                icon={Wrench} label="次回点検期限" color="bg-purple-50 text-purple-500"
                value="04/30" sub="自動火災報知設備"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements */}
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
            <div className="divide-y divide-gray-50">
              {recentAnnouncements.map((a) => {
                const p = priorityConfig[a.priority];
                return (
                  <div key={a.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 flex-shrink-0", p.color)}>
                        {p.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.publishedAt} · {a.authorName}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Meetings & Inquiries */}
          <div className="space-y-4">
            {/* Upcoming meetings */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-900">予定の会議</h2>
                </div>
                <Link href="/meetings" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  すべて <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {upcomingMeetings.map((m) => (
                  <div key={m.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-medium text-gray-900">{m.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.date} {m.time} · {m.location}</p>
                    <span className="text-xs text-blue-600 font-medium">{meetingTypeLabels[m.type]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Open inquiries */}
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
              <div className="divide-y divide-gray-50">
                {openInquiries.map((inq) => (
                  <div key={inq.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-medium text-gray-900 truncate">{inq.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("text-xs px-1.5 py-0.5 rounded",
                        inq.status === "open" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {inq.status === "open" ? "未対応" : "対応中"}
                      </span>
                      <span className="text-xs text-gray-500">{inq.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {dashboardStats.nextInspectionDue && isBoard && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">設備点検期限が近づいています</p>
              <p className="text-sm text-amber-700 mt-0.5">
                {dashboardStats.nextInspectionDue} の点検期限が迫っています。
                <Link href="/equipment" className="underline ml-1">設備管理で確認する</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
