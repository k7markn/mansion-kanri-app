import Header from "@/components/Header";
import { mockInquiries } from "@/data/mock";
import { cn } from "@/lib/utils";
import { MessageSquare, PlusCircle, User, EyeOff } from "lucide-react";

const categoryConfig: Record<string, { label: string; color: string }> = {
  equipment: { label: "設備不具合", color: "bg-orange-100 text-orange-700" },
  noise: { label: "騒音・トラブル", color: "bg-red-100 text-red-700" },
  facility: { label: "共用部への要望", color: "bg-blue-100 text-blue-700" },
  management_fee: { label: "管理費", color: "bg-green-100 text-green-700" },
  other: { label: "その他", color: "bg-gray-100 text-gray-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "未対応", color: "bg-red-100 text-red-700" },
  in_progress: { label: "対応中", color: "bg-yellow-100 text-yellow-700" },
  resolved: { label: "解決済", color: "bg-green-100 text-green-700" },
  pending: { label: "保留", color: "bg-gray-100 text-gray-600" },
};

export default function InquiriesPage() {
  const byStatus = {
    open: mockInquiries.filter(i => i.status === "open"),
    in_progress: mockInquiries.filter(i => i.status === "in_progress"),
    resolved: mockInquiries.filter(i => i.status === "resolved"),
    pending: mockInquiries.filter(i => i.status === "pending"),
  };

  return (
    <div>
      <Header title="問い合わせ管理" />
      <div className="p-6 space-y-6">

        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(byStatus).map(([status, items]) => {
            const s = statusConfig[status as keyof typeof statusConfig];
            return (
              <div key={status} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className={cn("text-2xl font-bold", items.length > 0 && status === "open" ? "text-red-600" : "text-gray-900")}>
                  {items.length}
                </p>
                <span className={cn("text-xs px-2 py-0.5 rounded", s.color)}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <span key={key} className={cn("text-xs px-3 py-1.5 rounded-full cursor-pointer border hover:opacity-80", cfg.color)}>
                {cfg.label}
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            <PlusCircle size={16} />
            問い合わせを送る
          </button>
        </div>

        {/* Inquiries List */}
        <div className="space-y-3">
          {[...mockInquiries]
            .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
            .map((inq) => {
              const cat = categoryConfig[inq.category];
              const st = statusConfig[inq.status];
              return (
                <div key={inq.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", cat.color)}>{cat.label}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", st.color)}>{st.label}</span>
                        <span className="text-xs text-gray-400">{inq.submittedAt}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{inq.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{inq.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {inq.isAnonymous ? <EyeOff size={12} /> : <User size={12} />}
                          {inq.isAnonymous ? "匿名" : inq.submitterName}・{inq.submitterUnit}
                        </span>
                        {inq.assignedTo && (
                          <span>担当: {inq.assignedTo}</span>
                        )}
                        {inq.resolvedAt && (
                          <span>解決日: {inq.resolvedAt}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        詳細
                      </button>
                      {inq.status !== "resolved" && (
                        <button className="text-xs px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                          対応する
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
