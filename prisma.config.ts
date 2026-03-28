import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // マイグレーション専用: Supabase Session Pooler (port 5432)
    // Transaction Pooler (port 6543) はDDL非対応のため使用不可
    url: process.env["DIRECT_URL"]!,
  },
});
