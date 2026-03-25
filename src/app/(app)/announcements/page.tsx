import Header from "@/components/Header";
import { mockAnnouncements, mockBulletinPosts } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Bell, MessageSquare, PlusCircle, Users, Eye } from "lucide-react";

const categoryConfig = {
  board: { label: "理事会", color: "bg-blue-100 text-blue-700" },
  construction: { label: "工事・点検", color: "bg-orange-100 text-orange-700" },
  emergency: { label: "緊急連絡", color: "bg-red-100 text-red-700" },
  general: { label: "一般", color: "bg-gray-100 text-gray-600" },
};

const priorityConfig = {
  urgent: { label: "緊急", color: "bg-red-500 text-white" },
  important: { label: "重要", color: "bg-orange-100 text-orange-700" },
  normal: { label: "", color: "" },
};

const bulletinCategoryConfig = {
  info: { label: "情報", color: "bg-blue-100 text-blue-700" },
  wanted: { label: "募集", color: "bg-green-100 text-green-700" },
  giveaway: { label: "譲ります", color: "bg-purple-100 text-purple-700" },
  other: { label: "その他", color: "bg-gray-100 text-gray-600" },
};

export default function AnnouncementsPage() {
  const sorted = [...mockAnnouncements].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div>
      <Header title="お知らせ・掲示板" />
      <div className="p-6 space-y-6">
        {/* Tabs header */}
        <div className="flex gap-2">
          <div className="bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
            <Bell size={14} /> お知らせ
          </div>
          <div className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
            <MessageSquare size={14} /> 掲示板
          </div>
        </div>

        {/* Action bar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <span key={key} className={cn("text-xs px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 border", cfg.color)}>
                {cfg.label}
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            <PlusCircle size={16} />
            投稿する
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-3">
          {sorted.map((a) => {
            const cat = categoryConfig[a.category];
            const pri = priorityConfig[a.priority];
            const readRate = Math.round((a.readCount / a.totalTargets) * 100);
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={cn("text-xs px-2 py-0.5 rounded font-medium", cat.color)}>{cat.label}</span>
                      {pri.label && (
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", pri.color)}>{pri.label}</span>
                      )}
                      <span className="text-xs text-gray-400">{a.publishedAt}</span>
                      {a.expiresAt && <span className="text-xs text-gray-400">〜{a.expiresAt}</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{a.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500">{a.authorName}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye size={12} />
                        <span>{a.readCount}/{a.totalTargets}件既読（{readRate}%）</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={12} />
                        <span>全住民宛</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulletin Board Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            住民掲示板
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBulletinPosts.map((post) => {
              const cat = bulletinCategoryConfig[post.category];
              return (
                <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded font-medium", cat.color)}>{cat.label}</span>
                    <span className="text-xs text-gray-400">{post.postedAt}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1.5">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">{post.authorName}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MessageSquare size={12} />
                      {post.comments}件のコメント
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
