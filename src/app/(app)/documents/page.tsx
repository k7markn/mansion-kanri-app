import Header from "@/components/Header";
import { mockDocuments } from "@/data/mock";
import { cn } from "@/lib/utils";
import { FileText, Download, Lock, Users, PlusCircle, Search } from "lucide-react";

const categoryConfig: Record<string, { label: string; color: string }> = {
  regulations: { label: "管理規約・細則", color: "bg-blue-100 text-blue-700" },
  minutes: { label: "議事録", color: "bg-green-100 text-green-700" },
  general_meeting: { label: "総会資料", color: "bg-indigo-100 text-indigo-700" },
  contract: { label: "契約書", color: "bg-orange-100 text-orange-700" },
  floor_plan: { label: "図面", color: "bg-purple-100 text-purple-700" },
  other: { label: "その他", color: "bg-gray-100 text-gray-600" },
};

const visibilityConfig = {
  all: { label: "全住民", icon: Users, color: "text-green-600" },
  board: { label: "役員のみ", icon: Lock, color: "text-orange-500" },
  management: { label: "管理会社のみ", icon: Lock, color: "text-red-500" },
};

function FileIcon({ category }: { category: string }) {
  const colors: Record<string, string> = {
    regulations: "bg-blue-100 text-blue-600",
    minutes: "bg-green-100 text-green-600",
    general_meeting: "bg-indigo-100 text-indigo-600",
    contract: "bg-orange-100 text-orange-600",
    floor_plan: "bg-purple-100 text-purple-600",
    other: "bg-gray-100 text-gray-500",
  };
  return (
    <div className={cn("p-2.5 rounded-lg flex-shrink-0", colors[category] || colors.other)}>
      <FileText size={20} />
    </div>
  );
}

export default function DocumentsPage() {
  const grouped = mockDocuments.reduce<Record<string, typeof mockDocuments>>((acc, doc) => {
    acc[doc.category] = [...(acc[doc.category] || []), doc];
    return acc;
  }, {});

  return (
    <div>
      <Header title="書類管理" />
      <div className="p-6 space-y-6">

        {/* Search & Actions */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="書類を検索..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap">
            <PlusCircle size={16} />
            書類をアップロード
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs px-3 py-1.5 bg-blue-700 text-white rounded-full cursor-pointer">すべて</span>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <span key={key} className={cn("text-xs px-3 py-1.5 rounded-full cursor-pointer border hover:opacity-80", cfg.color)}>
              {cfg.label}
            </span>
          ))}
        </div>

        {/* Documents by Category */}
        {Object.entries(grouped).map(([category, docs]) => {
          const cat = categoryConfig[category];
          return (
            <div key={category}>
              <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className={cn("text-xs px-2 py-0.5 rounded", cat.color)}>{cat.label}</span>
              </h2>
              <div className="space-y-2">
                {docs.map((doc) => {
                  const vis = visibilityConfig[doc.visibility];
                  const VisIcon = vis.icon;
                  return (
                    <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-4">
                        <FileIcon category={doc.category} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 flex-wrap">
                            <span>{doc.uploadedAt} 更新</span>
                            <span>v{doc.version}</span>
                            <span>{doc.fileSize}</span>
                            <span>{doc.uploadedBy}</span>
                            <span className={cn("flex items-center gap-0.5", vis.color)}>
                              <VisIcon size={11} /> {vis.label}
                            </span>
                            <span>{doc.downloadCount}回DL</span>
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline flex-shrink-0">
                          <Download size={14} />
                          ダウンロード
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
