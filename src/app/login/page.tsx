"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail } from "lucide-react";
import type { UserRole } from "@/types";

const DEMO_ACCOUNTS: { role: UserRole; label: string; email: string; color: string }[] = [
  { role: "resident", label: "住民", email: "tanaka@example.com", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { role: "board", label: "理事（理事長）", email: "sato@example.com", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { role: "management", label: "管理会社", email: "yamada@mgmt.co.jp", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sato@example.com");
  const [password, setPassword] = useState("password");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 px-8 py-8 text-white text-center">
          <div className="flex justify-center mb-3">
            <Building2 size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold">マンション管理組合</h1>
          <p className="text-blue-200 text-sm mt-1">サンシャイン東京マンション</p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              ログイン
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium">デモアカウントでログイン</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  onClick={() => handleDemoLogin(account.email)}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors text-left flex justify-between items-center ${account.color}`}
                >
                  <span>{account.label}</span>
                  <span className="text-xs opacity-70">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            ※ これはモックアプリです。実際の個人情報は使用していません。
          </p>
        </div>
      </div>
    </div>
  );
}
