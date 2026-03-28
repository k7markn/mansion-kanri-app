/**
 * Prisma Client シングルトン
 *
 * 接続方式: @prisma/adapter-pg (Supabase Transaction Pooler, port 6543)
 * - アプリのクエリには Transaction Pooler を使用（接続数を節約）
 * - マイグレーションには Session Pooler を使用（prisma.config.ts の DIRECT_URL）
 *
 * Prisma 7 では組み込み接続エンジンが廃止されたため adapter が必要。
 */
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
