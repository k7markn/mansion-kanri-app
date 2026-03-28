"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Users, Search, Building2 } from "lucide-react";
import type { UserRole } from "@/generated/prisma";

type Resident = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  position: string | null;
};

type Unit = {
  id: string;
  roomNumber: string;
  floor: number | null;
  area: number | null;
  ownershipRatio: number | null;
  building: { id: string; name: string } | null;
  residents: Resident[];
};

type Building = { id: string; name: string };

const roleConfig: Record<string, { label: string; color: string }> = {
  RESIDENT: { label: "住民", color: "bg-green-100 text-green-700" },
  BOARD: { label: "理事会", color: "bg-blue-100 text-blue-700" },
  MANAGEMENT: { label: "管理会社", color: "bg-purple-100 text-purple-700" },
  ADMIN: { label: "管理者", color: "bg-red-100 text-red-700" },
};

export default function UnitsClient({
  units,
  buildings,
  userRole,
}: {
  units: Unit[];
  buildings: Building[];
  userRole: UserRole;
}) {
  const [search, setSearch] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const filtered = units.filter((u) => {
    const matchSearch =
      !search ||
      u.roomNumber.includes(search) ||
      u.residents.some((r) => r.fullName.includes(search));
    const matchBuilding = !selectedBuilding || u.building?.id === selectedBuilding;
    return matchSearch && matchBuilding;
  });

  return (
    <div>
      <Header title="住戸・住民管理" />
      <div className="p-6 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{units.length}</p>
            <p className="text-xs text-gray-500 mt-1">総住戸数</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {units.filter((u) => u.residents.length > 0).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">入居済み</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {units.reduce((sum, u) => sum + u.residents.length, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">登録住民数</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="部屋番号・氏名で検索..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {buildings.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedBuilding(null)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors",
                  !selectedBuilding ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                )}
              >
                すべての棟
              </button>
              {buildings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuilding(selectedBuilding === b.id ? null : b.id)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1",
                    selectedBuilding === b.id ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Building2 size={11} />
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Units List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">住戸データがありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((unit) => (
              <div key={unit.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-lg p-3 flex-shrink-0 text-center min-w-[72px]">
                    {unit.building && (
                      <p className="text-xs text-gray-500 mb-0.5">{unit.building.name}</p>
                    )}
                    <p className="text-lg font-bold text-gray-900">{unit.roomNumber}</p>
                    <p className="text-xs text-gray-400">号室</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      {unit.floor && <span>{unit.floor}階</span>}
                      {unit.area && <span>{unit.area}㎡</span>}
                      {unit.ownershipRatio && <span>持分 {unit.ownershipRatio}%</span>}
                    </div>
                    {unit.residents.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">未入居</p>
                    ) : (
                      <div className="space-y-1.5">
                        {unit.residents.map((r) => {
                          const roleInfo = roleConfig[r.role] ?? roleConfig.RESIDENT;
                          return (
                            <div key={r.id} className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {r.fullName.slice(0, 1)}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900">{r.fullName}</span>
                                {r.position && (
                                  <span className="text-xs text-gray-500 ml-1">（{r.position}）</span>
                                )}
                              </div>
                              <span className={cn("text-xs px-1.5 py-0.5 rounded ml-1", roleInfo.color)}>
                                {roleInfo.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
