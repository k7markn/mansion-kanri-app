import Header from "@/components/Header";
import { mockSurveys } from "@/data/mock";
import { cn } from "@/lib/utils";
import { ClipboardList, PlusCircle, EyeOff, CheckCircle2 } from "lucide-react";

const statusConfig = {
  active: { label: "受付中", color: "bg-green-100 text-green-700" },
  closed: { label: "終了", color: "bg-gray-100 text-gray-600" },
  draft: { label: "下書き", color: "bg-yellow-100 text-yellow-700" },
};

function ResponseRate({ count, total }: { count: number; total: number }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{count}/{total}名 回答済</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", pct >= 70 ? "bg-green-400" : pct >= 40 ? "bg-yellow-400" : "bg-red-400")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SurveysPage() {
  const active = mockSurveys.filter(s => s.status === "active");
  const closed = mockSurveys.filter(s => s.status === "closed");

  return (
    <div>
      <Header title="投票・アンケート" />
      <div className="p-6 space-y-6">

        {/* Actions */}
        <div className="flex justify-end">
          <button className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            <PlusCircle size={16} />
            アンケートを作成
          </button>
        </div>

        {/* Active Surveys */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-600" />
            受付中のアンケート
          </h2>
          <div className="space-y-4">
            {active.map((survey) => {
              const s = statusConfig[survey.status];
              return (
                <div key={survey.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", s.color)}>{s.label}</span>
                        {survey.isAnonymous && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <EyeOff size={11} /> 匿名
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {survey.startDate} 〜 {survey.endDate}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{survey.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{survey.description}</p>
                      <ResponseRate count={survey.responseCount} total={survey.totalTargets} />
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        結果を見る
                      </button>
                      <button className="text-xs px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                        回答する
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Closed Surveys */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-gray-500" />
            終了したアンケート
          </h2>
          <div className="space-y-3">
            {closed.map((survey) => {
              const pct = Math.round((survey.responseCount / survey.totalTargets) * 100);
              return (
                <div key={survey.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{survey.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {survey.startDate} 〜 {survey.endDate} ·
                        回答率: {pct}%（{survey.responseCount}/{survey.totalTargets}名）
                      </p>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline flex-shrink-0">
                      結果を見る
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sample Result Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">集計結果サンプル：2025年度 管理会社サービス満足度調査</h2>
          <div className="space-y-3">
            {[
              { label: "とても満足", count: 12, color: "bg-green-500" },
              { label: "満足", count: 18, color: "bg-green-300" },
              { label: "普通", count: 7, color: "bg-gray-300" },
              { label: "不満", count: 3, color: "bg-orange-400" },
              { label: "とても不満", count: 1, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="text-gray-500">{item.count}票</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full flex items-center pl-2 text-white text-xs", item.color)}
                    style={{ width: `${(item.count / 41) * 100}%` }}
                  >
                    {Math.round((item.count / 41) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
