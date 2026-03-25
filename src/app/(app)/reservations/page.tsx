import Header from "@/components/Header";
import { mockFacilities, mockReservations } from "@/data/mock";
import { cn } from "@/lib/utils";
import { CalendarCheck, Users, Clock, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";

const statusConfig = {
  confirmed: { label: "確定", color: "bg-green-100 text-green-700" },
  pending: { label: "承認待ち", color: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "キャンセル", color: "bg-gray-100 text-gray-500" },
};

function formatYen(n: number) { return `¥${n.toLocaleString()}`; }

export default function ReservationsPage() {
  return (
    <div>
      <Header title="共用施設予約" />
      <div className="p-6 space-y-6">

        {/* Facilities */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CalendarCheck size={18} className="text-blue-600" />
            施設一覧
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockFacilities.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-1">{f.name}</h3>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    最大 {f.capacity}名
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {f.availableHours.start} 〜 {f.availableHours.end}
                  </div>
                  <div className="text-gray-700 font-medium">{formatYen(f.pricePerHour)} / 時間</div>
                  {f.requiresApproval && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle size={11} />
                      承認制
                    </div>
                  )}
                  {!f.requiresApproval && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={11} />
                      即時予約可
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{f.description}</p>
                <button className="w-full mt-3 text-xs bg-blue-700 text-white py-1.5 rounded-lg hover:bg-blue-800 transition-colors">
                  予約する
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reservations */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">予約一覧</h2>
            <button className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              <PlusCircle size={16} />
              新規予約
            </button>
          </div>

          {/* Calendar View placeholder */}
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
              {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
                <div key={d} className="py-1 font-medium">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 5; // March 2026 starts on Sunday
                const isToday = day === 25;
                const hasReservation = [28, 30].includes(day);
                return (
                  <div
                    key={i}
                    className={cn(
                      "py-2 rounded cursor-pointer transition-colors",
                      day < 1 || day > 31 ? "text-gray-300" : "hover:bg-blue-50",
                      isToday ? "bg-blue-600 text-white hover:bg-blue-700" : "",
                      hasReservation && !isToday ? "bg-blue-50 text-blue-700 font-medium" : ""
                    )}
                  >
                    {day >= 1 && day <= 31 ? day : ""}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">2026年3月 ● 予約あり</p>
          </div>

          <div className="divide-y divide-gray-50">
            {mockReservations.map((r) => {
              const s = statusConfig[r.status];
              return (
                <div key={r.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-gray-900">{r.facilityName}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded", s.color)}>{s.label}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {r.date} {r.startTime}〜{r.endTime}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{r.userName}（{r.unitLabel}）</span>
                        <span>用途: {r.purpose}</span>
                        <span className="font-medium text-gray-700">{formatYen(r.fee)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {r.status === "pending" && (
                        <>
                          <button className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            承認
                          </button>
                          <button className="text-xs px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            却下
                          </button>
                        </>
                      )}
                      {r.status === "confirmed" && (
                        <button className="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                          キャンセル
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
    </div>
  );
}
