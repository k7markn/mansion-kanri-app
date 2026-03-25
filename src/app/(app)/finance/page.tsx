import Header from "@/components/Header";
import {
  mockIncomeRecords, mockExpenseRecords, mockBudgetItems, mockMonthlySummary,
} from "@/data/mock";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Download } from "lucide-react";

const paymentStatusConfig = {
  paid: { label: "収納済", color: "bg-green-100 text-green-700" },
  unpaid: { label: "未収", color: "bg-yellow-100 text-yellow-700" },
  partial: { label: "一部収納", color: "bg-orange-100 text-orange-700" },
  overdue: { label: "滞納", color: "bg-red-100 text-red-700" },
};

const incomeTypeLabels = {
  management_fee: "管理費",
  repair_reserve: "修繕積立金",
  special: "臨時徴収",
  other: "その他",
};

const approvalStatusConfig = {
  approved: { label: "承認済", color: "bg-green-100 text-green-700" },
  pending: { label: "承認待", color: "bg-yellow-100 text-yellow-700" },
  rejected: { label: "却下", color: "bg-red-100 text-red-700" },
};

function formatYen(amount: number) {
  return `¥${amount.toLocaleString()}`;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function FinancePage() {
  const totalIncome = mockIncomeRecords.filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0);
  const totalExpense = mockExpenseRecords.filter(r => r.approvalStatus === "approved").reduce((s, r) => s + r.amount, 0);
  const unpaidCount = mockIncomeRecords.filter(r => r.status === "unpaid" || r.status === "overdue").length;

  const latestMonth = mockMonthlySummary[mockMonthlySummary.length - 1];

  return (
    <div>
      <Header title="会計・財務管理" />
      <div className="p-6 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-50 p-2 rounded-lg"><TrendingUp size={20} className="text-green-600" /></div>
              <p className="text-sm text-gray-500">3月 収入合計</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatYen(totalIncome)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-50 p-2 rounded-lg"><TrendingDown size={20} className="text-red-500" /></div>
              <p className="text-sm text-gray-500">3月 支出合計（承認済）</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatYen(totalExpense)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-50 p-2 rounded-lg"><AlertTriangle size={20} className="text-orange-500" /></div>
              <p className="text-sm text-gray-500">未収・滞納件数</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{unpaidCount}件</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Summary */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Wallet size={18} className="text-blue-600" />
                月次収支推移
              </h2>
              <button className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                <Download size={12} /> エクスポート
              </button>
            </div>
            <div className="p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100">
                    <th className="text-left pb-2">月</th>
                    <th className="text-right pb-2">収入</th>
                    <th className="text-right pb-2">支出</th>
                    <th className="text-right pb-2">差引</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMonthlySummary.map((row) => (
                    <tr key={row.month} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 text-gray-700">{row.month}</td>
                      <td className="py-2.5 text-right text-green-600">{formatYen(row.income)}</td>
                      <td className="py-2.5 text-right text-red-500">{formatYen(row.expense)}</td>
                      <td className="py-2.5 text-right font-medium text-gray-900">{formatYen(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Budget vs Actual */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">予算 vs 実績（年度累計）</h2>
            </div>
            <div className="p-5 space-y-4">
              {mockBudgetItems.map((item) => {
                const pct = Math.round((item.actual / item.budgeted) * 100);
                const isOver = item.actual > item.budgeted && item.type === "expense";
                return (
                  <div key={item.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.category}</span>
                      <span className={cn("font-medium", isOver ? "text-red-600" : "text-gray-900")}>
                        {formatYen(item.actual)} / {formatYen(item.budgeted)}
                        <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
                      </span>
                    </div>
                    <ProgressBar
                      value={item.actual}
                      max={item.budgeted}
                      color={item.type === "income" ? "bg-green-400" : isOver ? "bg-red-400" : "bg-blue-400"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Income Records */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">収入明細（2026年3月）</h2>
            <button className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
              <Download size={12} /> CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3">住戸</th>
                  <th className="text-left px-4 py-3">種別</th>
                  <th className="text-right px-4 py-3">金額</th>
                  <th className="text-left px-4 py-3">状態</th>
                  <th className="text-left px-4 py-3">収納日</th>
                </tr>
              </thead>
              <tbody>
                {mockIncomeRecords.map((r) => {
                  const s = paymentStatusConfig[r.status];
                  return (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-900">{r.unitLabel}</td>
                      <td className="px-4 py-3 text-gray-600">{incomeTypeLabels[r.type]}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatYen(r.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded", s.color)}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{r.paidAt ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Records */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">支出明細（2026年3月）</h2>
            <button className="text-xs bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors">
              支出を記録
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3">科目</th>
                  <th className="text-left px-4 py-3">摘要</th>
                  <th className="text-left px-4 py-3">業者</th>
                  <th className="text-right px-4 py-3">金額</th>
                  <th className="text-left px-4 py-3">承認</th>
                </tr>
              </thead>
              <tbody>
                {mockExpenseRecords.map((r) => {
                  const s = approvalStatusConfig[r.approvalStatus];
                  return (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{r.category}</td>
                      <td className="px-4 py-3 text-gray-600">{r.description}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.vendor}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatYen(r.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded", s.color)}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
