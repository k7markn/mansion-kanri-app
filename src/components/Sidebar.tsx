"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2, LayoutDashboard, Bell, Users, CalendarDays,
  Wallet, Wrench, MessageSquare, CalendarCheck, FileText,
  ClipboardList, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import type { ProfileForLayout } from "@/app/(app)/layout";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard, roles: ["RESIDENT", "BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/announcements", label: "お知らせ・掲示板", icon: Bell, roles: ["RESIDENT", "BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/inquiries", label: "問い合わせ", icon: MessageSquare, roles: ["RESIDENT", "BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/documents", label: "書類管理", icon: FileText, roles: ["RESIDENT", "BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/units", label: "住戸・住民管理", icon: Users, roles: ["BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/meetings", label: "総会・理事会", icon: CalendarDays, roles: ["BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/finance", label: "会計・財務", icon: Wallet, roles: ["BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/equipment", label: "修繕・設備管理", icon: Wrench, roles: ["BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/reservations", label: "共用施設予約", icon: CalendarCheck, roles: ["RESIDENT", "BOARD", "MANAGEMENT", "ADMIN"] },
  { href: "/surveys", label: "投票・アンケート", icon: ClipboardList, roles: ["RESIDENT", "BOARD", "MANAGEMENT", "ADMIN"] },
];

const roleLabels: Record<string, { label: string; color: string }> = {
  RESIDENT: { label: "住民", color: "bg-green-100 text-green-800" },
  BOARD: { label: "理事会", color: "bg-blue-100 text-blue-800" },
  MANAGEMENT: { label: "管理会社", color: "bg-purple-100 text-purple-800" },
  ADMIN: { label: "管理者", color: "bg-red-100 text-red-800" },
};

export default function Sidebar({ profile }: { profile: ProfileForLayout }) {
  const pathname = usePathname();
  const roleInfo = roleLabels[profile.role] ?? roleLabels.RESIDENT;
  const visibleNav = navItems.filter((item) => item.roles.includes(profile.role));
  const initials = profile.fullName.slice(0, 2);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <div className="bg-blue-700 text-white p-1.5 rounded-lg">
          <Building2 size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">サンシャイン東京</p>
          <p className="text-xs text-gray-500">管理組合</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{profile.fullName}</p>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", roleInfo.color)}>
                {roleInfo.label}
              </span>
              {profile.position && (
                <span className="text-xs text-gray-500">{profile.position}</span>
              )}
            </div>
            {profile.unit && (
              <p className="text-xs text-gray-400 mt-0.5">
                {profile.unit.building?.name ?? ""} {profile.unit.roomNumber}号室
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={18} className={isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-blue-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full"
          >
            <LogOut size={16} />
            <span>ログアウト</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
