"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Bell, PlusCircle, Eye, X, ChevronDown } from "lucide-react";
import type { UserRole } from "@/generated/prisma";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  publishedAt: string | null;
  expiresAt: string | null;
  author: { fullName: string };
  reads: { readAt: string }[];
  _count: { reads: number };
  createdAt: string;
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  BOARD: { label: "理事会", color: "bg-blue-100 text-blue-700" },
  CONSTRUCTION: { label: "工事・点検", color: "bg-orange-100 text-orange-700" },
  EMERGENCY: { label: "緊急連絡", color: "bg-red-100 text-red-700" },
  GENERAL: { label: "一般", color: "bg-gray-100 text-gray-600" },
  BULLETIN: { label: "掲示板", color: "bg-green-100 text-green-700" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  URGENT: { label: "緊急", color: "bg-red-500 text-white" },
  IMPORTANT: { label: "重要", color: "bg-orange-100 text-orange-700" },
  NORMAL: { label: "", color: "" },
};

const categoryOptions = [
  { value: "BOARD", label: "理事会からのお知らせ" },
  { value: "CONSTRUCTION", label: "工事・点検情報" },
  { value: "EMERGENCY", label: "緊急連絡" },
  { value: "GENERAL", label: "一般" },
  { value: "BULLETIN", label: "住民掲示板" },
];

const priorityOptions = [
  { value: "NORMAL", label: "通常" },
  { value: "IMPORTANT", label: "重要" },
  { value: "URGENT", label: "緊急" },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

export default function AnnouncementsClient({
  announcements,
  userRole,
}: {
  announcements: Announcement[];
  userRole: UserRole;
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "", content: "", category: "GENERAL", priority: "NORMAL",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPost = userRole !== "RESIDENT";

  const filtered = activeCategory
    ? announcements.filter((a) => a.category === activeCategory)
    : announcements;

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "投稿に失敗しました");
        return;
      }
      setShowForm(false);
      setFormData({ title: "", content: "", category: "GENERAL", priority: "NORMAL" });
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Header title="お知らせ・掲示板" />
      <div className="p-6 space-y-6">
        {/* Action bar */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                !activeCategory
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              )}
            >
              すべて
            </button>
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key === activeCategory ? null : key)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors",
                  activeCategory === key
                    ? "ring-2 ring-offset-1 ring-blue-500"
                    : "hover:opacity-80",
                  cfg.color
                )}
              >
                {cfg.label}
              </button>
            ))}
          </div>
          {canPost && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <PlusCircle size={16} />
              投稿する
            </button>
          )}
        </div>

        {/* New Announcement Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">お知らせを投稿</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{error}</p>
            )}
            <form onSubmit={handlePost} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">カテゴリ</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">重要度</label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData((f) => ({ ...f, priority: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="タイトルを入力"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">本文</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="内容を入力"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60"
                >
                  {submitting ? "投稿中..." : "投稿する"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">お知らせはありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => {
              const cat = categoryConfig[a.category] ?? categoryConfig.GENERAL;
              const pri = priorityConfig[a.priority] ?? priorityConfig.NORMAL;
              const isRead = a.reads.length > 0;
              return (
                <div
                  key={a.id}
                  className={cn(
                    "bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow cursor-pointer",
                    isRead ? "border-gray-200" : "border-blue-300 bg-blue-50/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!isRead && (
                      <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", cat.color)}>{cat.label}</span>
                        {pri.label && (
                          <span className={cn("text-xs px-2 py-0.5 rounded font-medium", pri.color)}>{pri.label}</span>
                        )}
                        <span className="text-xs text-gray-400">{formatDate(a.publishedAt ?? a.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{a.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-500">{a.author.fullName}</span>
                        {canPost && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Eye size={12} />
                            <span>{a._count.reads}件既読</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
