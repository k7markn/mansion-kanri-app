"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { MessageSquare, PlusCircle, User, EyeOff, X, ChevronDown } from "lucide-react";
import type { UserRole } from "@/generated/prisma";

type Inquiry = {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  submitter: {
    fullName: string;
    unit: { roomNumber: string; building: { name: string } | null } | null;
  } | null;
  _count: { comments: number };
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  EQUIPMENT: { label: "設備不具合", color: "bg-orange-100 text-orange-700" },
  NOISE: { label: "騒音・トラブル", color: "bg-red-100 text-red-700" },
  COMMON_AREA: { label: "共用部への要望", color: "bg-blue-100 text-blue-700" },
  OTHER: { label: "その他", color: "bg-gray-100 text-gray-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: "受付済", color: "bg-red-100 text-red-700" },
  IN_PROGRESS: { label: "対応中", color: "bg-yellow-100 text-yellow-700" },
  COMPLETED: { label: "完了", color: "bg-green-100 text-green-700" },
  ON_HOLD: { label: "保留", color: "bg-gray-100 text-gray-600" },
};

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

export default function InquiriesClient({
  inquiries,
  userRole,
}: {
  inquiries: Inquiry[];
  userRole: UserRole;
}) {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "", content: "", category: "OTHER", isAnonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBoard = userRole !== "RESIDENT";

  const filtered = activeStatus
    ? inquiries.filter((i) => i.status === activeStatus)
    : inquiries;

  const counts = {
    RECEIVED: inquiries.filter((i) => i.status === "RECEIVED").length,
    IN_PROGRESS: inquiries.filter((i) => i.status === "IN_PROGRESS").length,
    COMPLETED: inquiries.filter((i) => i.status === "COMPLETED").length,
    ON_HOLD: inquiries.filter((i) => i.status === "ON_HOLD").length,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "送信に失敗しました");
        return;
      }
      setShowForm(false);
      setFormData({ title: "", content: "", category: "OTHER", isAnonymous: false });
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <Header title="問い合わせ管理" />
      <div className="p-6 space-y-6">

        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([status, cfg]) => (
            <button
              key={status}
              onClick={() => setActiveStatus(activeStatus === status ? null : status)}
              className={cn(
                "bg-white rounded-xl border p-4 text-center transition-all",
                activeStatus === status ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
              )}
            >
              <p className={cn("text-2xl font-bold", status === "RECEIVED" && counts[status as keyof typeof counts] > 0 ? "text-red-600" : "text-gray-900")}>
                {counts[status as keyof typeof counts]}
              </p>
              <span className={cn("text-xs px-2 py-0.5 rounded mt-1 inline-block", cfg.color)}>{cfg.label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {activeStatus ? `${statusConfig[activeStatus].label}の問い合わせ` : "すべての問い合わせ"}（{filtered.length}件）
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <PlusCircle size={16} />
            問い合わせを送る
          </button>
        </div>

        {/* New Inquiry Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">問い合わせを送る</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">カテゴリ</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(categoryConfig).map(([v, c]) => (
                      <option key={v} value={v}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">件名</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="件名を入力"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="内容を詳しく入力してください"
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData((f) => ({ ...f, isAnonymous: e.target.checked }))}
                  className="rounded"
                />
                匿名で送る
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  キャンセル
                </button>
                <button type="submit" disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60">
                  {submitting ? "送信中..." : "送信する"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inquiries List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">問い合わせはありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inq) => {
              const cat = categoryConfig[inq.category] ?? categoryConfig.OTHER;
              const st = statusConfig[inq.status] ?? statusConfig.RECEIVED;
              return (
                <div key={inq.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", cat.color)}>{cat.label}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", st.color)}>{st.label}</span>
                        <span className="text-xs text-gray-400">{formatDate(inq.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{inq.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{inq.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {inq.isAnonymous ? <EyeOff size={12} /> : <User size={12} />}
                          {inq.isAnonymous
                            ? "匿名"
                            : inq.submitter
                            ? `${inq.submitter.fullName}${inq.submitter.unit ? `・${inq.submitter.unit.building?.name ?? ""}${inq.submitter.unit.roomNumber}号室` : ""}`
                            : "不明"}
                        </span>
                        {inq._count.comments > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            {inq._count.comments}件のコメント
                          </span>
                        )}
                      </div>
                    </div>
                    {isBoard && inq.status !== "COMPLETED" && (
                      <div className="flex gap-2 flex-shrink-0">
                        {inq.status === "RECEIVED" && (
                          <button
                            onClick={() => handleStatusChange(inq.id, "IN_PROGRESS")}
                            className="text-xs px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                          >
                            対応開始
                          </button>
                        )}
                        {inq.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleStatusChange(inq.id, "COMPLETED")}
                            className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            完了
                          </button>
                        )}
                      </div>
                    )}
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
