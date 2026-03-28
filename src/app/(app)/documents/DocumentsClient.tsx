"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { FileText, Download, Lock, Users, Search } from "lucide-react";
import type { UserRole } from "@/generated/prisma";

type Document = {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  visibility: string;
  version: number;
  description: string | null;
  createdAt: string;
  uploadedBy: { fullName: string };
};

const categoryConfig: Record<string, { label: string; color: string; iconColor: string }> = {
  RULES: { label: "管理規約", color: "bg-blue-100 text-blue-700", iconColor: "bg-blue-100 text-blue-600" },
  BYLAWS: { label: "使用細則", color: "bg-indigo-100 text-indigo-700", iconColor: "bg-indigo-100 text-indigo-600" },
  MINUTES: { label: "議事録", color: "bg-green-100 text-green-700", iconColor: "bg-green-100 text-green-600" },
  MEETING_DOCS: { label: "総会資料", color: "bg-purple-100 text-purple-700", iconColor: "bg-purple-100 text-purple-600" },
  CONTRACTS: { label: "契約書", color: "bg-orange-100 text-orange-700", iconColor: "bg-orange-100 text-orange-600" },
  DRAWINGS: { label: "図面", color: "bg-pink-100 text-pink-700", iconColor: "bg-pink-100 text-pink-600" },
  OTHER: { label: "その他", color: "bg-gray-100 text-gray-600", iconColor: "bg-gray-100 text-gray-500" },
};

const visibilityConfig: Record<string, { label: string; color: string }> = {
  ALL_RESIDENTS: { label: "全住民", color: "text-green-600" },
  BOARD_ONLY: { label: "役員のみ", color: "text-orange-500" },
  MANAGEMENT_ONLY: { label: "管理会社のみ", color: "text-red-500" },
};

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });
}

export default function DocumentsClient({
  documents,
  userRole,
}: {
  documents: Document[];
  userRole: UserRole;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = documents.filter((d) => {
    const matchSearch = !search || d.title.includes(search) || d.fileName.includes(search);
    const matchCategory = !activeCategory || d.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const grouped = filtered.reduce<Record<string, Document[]>>((acc, doc) => {
    acc[doc.category] = [...(acc[doc.category] ?? []), doc];
    return acc;
  }, {});

  return (
    <div>
      <Header title="書類管理" />
      <div className="p-6 space-y-6">

        {/* Search */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="書類を検索..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">{filtered.length}件</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full transition-colors",
              !activeCategory ? "bg-blue-700 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
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
                activeCategory === key ? "ring-2 ring-offset-1 ring-blue-500" : "hover:opacity-80",
                cfg.color
              )}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Documents by Category */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">書類はありません</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, docs]) => {
            const cat = categoryConfig[category] ?? categoryConfig.OTHER;
            return (
              <div key={category}>
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded", cat.color)}>{cat.label}</span>
                </h2>
                <div className="space-y-2">
                  {docs.map((doc) => {
                    const vis = visibilityConfig[doc.visibility] ?? visibilityConfig.ALL_RESIDENTS;
                    return (
                      <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2.5 rounded-lg flex-shrink-0", cat.iconColor)}>
                            <FileText size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 flex-wrap">
                              <span>{formatDate(doc.createdAt)}</span>
                              <span>v{doc.version}</span>
                              {doc.fileSize && <span>{formatFileSize(doc.fileSize)}</span>}
                              <span>{doc.uploadedBy.fullName}</span>
                              <span className={cn("flex items-center gap-0.5", vis.color)}>
                                {doc.visibility === "ALL_RESIDENTS" ? <Users size={11} /> : <Lock size={11} />}
                                {vis.label}
                              </span>
                            </div>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline flex-shrink-0"
                          >
                            <Download size={14} />
                            ダウンロード
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
