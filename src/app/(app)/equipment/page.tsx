import Header from "@/components/Header";
import { mockEquipment, mockInspectionRecords } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Wrench, AlertTriangle, CheckCircle2, XCircle, Calendar, PlusCircle } from "lucide-react";

const categoryLabels: Record<string, string> = {
  electrical: "電気設備",
  plumbing: "給排水設備",
  fire: "消防設備",
  elevator: "エレベーター",
  exterior: "外装",
  other: "その他",
};

const statusConfig = {
  normal: { label: "正常", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  attention: { label: "要注意", color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle },
  urgent: { label: "要対応", color: "bg-red-100 text-red-700", icon: XCircle },
};

const inspectionResultConfig = {
  pass: { label: "合格", color: "bg-green-100 text-green-700" },
  attention: { label: "要観察", color: "bg-yellow-100 text-yellow-700" },
  fail: { label: "不合格", color: "bg-red-100 text-red-700" },
};

export default function EquipmentPage() {
  const urgentCount = mockEquipment.filter(e => e.status === "urgent").length;
  const attentionCount = mockEquipment.filter(e => e.status === "attention").length;

  return (
    <div>
      <Header title="修繕・設備管理" />
      <div className="p-6 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{mockEquipment.length}</p>
            <p className="text-sm text-gray-500 mt-1">登録設備数</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{urgentCount}</p>
            <p className="text-sm text-gray-500 mt-1">要対応</p>
          </div>
          <div className="bg-white rounded-xl border border-yellow-200 p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{attentionCount}</p>
            <p className="text-sm text-gray-500 mt-1">要注意</p>
          </div>
        </div>

        {/* Equipment List */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Wrench size={18} className="text-blue-600" />
              設備台帳
            </h2>
            <button className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              <PlusCircle size={16} />
              設備登録
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {mockEquipment.map((eq) => {
              const s = statusConfig[eq.status];
              const StatusIcon = s.icon;
              const isNearInspection = new Date(eq.nextInspectionDate) <= new Date("2026-05-31");
              return (
                <div key={eq.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-gray-900">{eq.name}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1", s.color)}>
                          <StatusIcon size={11} /> {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <span>{categoryLabels[eq.category]}</span>
                        <span>{eq.location}</span>
                        <span>{eq.manufacturer} {eq.model}</span>
                        <span>設置: {eq.installedAt}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className={cn("flex items-center gap-1 text-xs", isNearInspection ? "text-red-600 font-medium" : "text-gray-500")}>
                        <Calendar size={12} />
                        次回点検: {eq.nextInspectionDate}
                      </div>
                      {isNearInspection && (
                        <span className="text-xs text-red-500 mt-0.5">⚠ 期限が近づいています</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspection Records */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">最近の点検記録</h2>
            <button className="text-xs bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors">
              点検記録を追加
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {mockInspectionRecords.map((record) => {
              const r = inspectionResultConfig[record.result];
              return (
                <div key={record.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{record.equipmentName}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded", r.color)}>{r.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {record.date} · {record.vendor}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">{record.notes}</p>
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
