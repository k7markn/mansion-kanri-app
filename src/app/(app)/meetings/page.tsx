import Header from "@/components/Header";
import { mockMeetings } from "@/data/mock";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle2, Clock, XCircle, FileText, Users, PlusCircle } from "lucide-react";

const typeConfig: Record<string, { label: string; color: string }> = {
  annual_general: { label: "定期総会", color: "bg-blue-100 text-blue-800" },
  extraordinary_general: { label: "臨時総会", color: "bg-indigo-100 text-indigo-800" },
  board: { label: "理事会", color: "bg-green-100 text-green-800" },
  extraordinary_board: { label: "臨時理事会", color: "bg-teal-100 text-teal-800" },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  scheduled: { label: "予定", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  ongoing: { label: "開催中", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  completed: { label: "完了", color: "bg-gray-50 text-gray-600 border-gray-200", icon: CheckCircle2 },
  cancelled: { label: "中止", color: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
};

export default function MeetingsPage() {
  const sorted = [...mockMeetings].sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = sorted.filter((m) => m.status === "scheduled");
  const past = sorted.filter((m) => m.status === "completed" || m.status === "cancelled");

  return (
    <div>
      <Header title="総会・理事会管理" />
      <div className="p-6 space-y-6">
        {/* Actions */}
        <div className="flex justify-end">
          <button className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            <PlusCircle size={16} />
            会議を登録
          </button>
        </div>

        {/* Upcoming */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />
            予定の会議
          </h2>
          <div className="space-y-4">
            {upcoming.map((m) => {
              const type = typeConfig[m.type];
              const status = statusConfig[m.status];
              const StatusIcon = status.icon;
              return (
                <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", type.color)}>{type.label}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border flex items-center gap-1", status.color)}>
                          <StatusIcon size={11} /> {status.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{m.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} />
                          {m.date} {m.time}
                        </span>
                        <span>{m.location}</span>
                        {m.totalEligible && (
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            対象: {m.totalEligible}名
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        出欠確認
                      </button>
                      <button className="text-xs px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                        詳細
                      </button>
                    </div>
                  </div>
                  {/* Agendas */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">議題</p>
                    <ol className="space-y-1">
                      {m.agendas.map((agenda, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                          {agenda}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Past */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-gray-500" />
            過去の会議
          </h2>
          <div className="space-y-3">
            {past.map((m) => {
              const type = typeConfig[m.type];
              const attendanceRate = m.attendeeCount && m.totalEligible
                ? Math.round((m.attendeeCount / m.totalEligible) * 100)
                : null;
              return (
                <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", type.color)}>{type.label}</span>
                        <span className="text-xs text-gray-400">{m.date}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{m.title}</h3>
                      {attendanceRate !== null && (
                        <p className="text-xs text-gray-500 mt-1">
                          出席: {m.attendeeCount}/{m.totalEligible}名（{attendanceRate}%）
                        </p>
                      )}
                    </div>
                    {m.minutesUrl && (
                      <a
                        href={m.minutesUrl}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline flex-shrink-0"
                      >
                        <FileText size={14} />
                        議事録
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
