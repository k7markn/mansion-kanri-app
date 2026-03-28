import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// seed はNext.jsランタイム外で実行されるため、src/lib/prisma.ts を使わず直接生成
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("🌱 シードデータを投入中...");

  // ユーザーID（Supabase Auth で作成済みのUUID）
  // .env に SEED_ADMIN_ID / SEED_BOARD_ID / SEED_RESIDENT_ID を設定して使用
  const ADMIN_ID    = process.env.SEED_ADMIN_ID;
  const BOARD_ID    = process.env.SEED_BOARD_ID;
  const RESIDENT_ID = process.env.SEED_RESIDENT_ID;

  if (!ADMIN_ID || !BOARD_ID || !RESIDENT_ID) {
    throw new Error(
      "SEED_ADMIN_ID / SEED_BOARD_ID / SEED_RESIDENT_ID を .env に設定してください\n" +
      "Supabase ダッシュボード → Authentication → Users でUIDを確認できます"
    );
  }

  // 棟
  const building = await prisma.building.upsert({
    where: { id: "building-1" },
    update: {},
    create: { id: "building-1", name: "A棟" },
  });
  console.log("✅ 棟:", building.name);

  // 住戸
  const units = await Promise.all([
    prisma.unit.upsert({
      where: { buildingId_roomNumber: { buildingId: building.id, roomNumber: "101" } },
      update: {},
      create: { buildingId: building.id, roomNumber: "101", floor: 1, area: 65.5, ownershipRatio: 1.2 },
    }),
    prisma.unit.upsert({
      where: { buildingId_roomNumber: { buildingId: building.id, roomNumber: "201" } },
      update: {},
      create: { buildingId: building.id, roomNumber: "201", floor: 2, area: 72.0, ownershipRatio: 1.4 },
    }),
    prisma.unit.upsert({
      where: { buildingId_roomNumber: { buildingId: building.id, roomNumber: "301" } },
      update: {},
      create: { buildingId: building.id, roomNumber: "301", floor: 3, area: 80.5, ownershipRatio: 1.6 },
    }),
    prisma.unit.upsert({
      where: { buildingId_roomNumber: { buildingId: building.id, roomNumber: "401" } },
      update: {},
      create: { buildingId: building.id, roomNumber: "401", floor: 4, area: 85.0, ownershipRatio: 1.7 },
    }),
    prisma.unit.upsert({
      where: { buildingId_roomNumber: { buildingId: building.id, roomNumber: "501" } },
      update: {},
      create: { buildingId: building.id, roomNumber: "501", floor: 5, area: 90.0, ownershipRatio: 1.8 },
    }),
  ]);
  console.log(`✅ 住戸: ${units.length}件`);

  // プロフィール
  const [adminProfile, boardProfile, residentProfile] = await Promise.all([
    prisma.profile.upsert({
      where: { id: ADMIN_ID },
      update: {},
      create: {
        id: ADMIN_ID,
        email: "admin@sunshine-tokyo.jp",
        fullName: "佐藤 一郎",
        role: "BOARD",
        position: "理事長",
        unitId: units[1].id,
      },
    }),
    prisma.profile.upsert({
      where: { id: BOARD_ID },
      update: {},
      create: {
        id: BOARD_ID,
        email: "board@sunshine-tokyo.jp",
        fullName: "田中 二郎",
        role: "BOARD",
        position: "理事",
        unitId: units[2].id,
      },
    }),
    prisma.profile.upsert({
      where: { id: RESIDENT_ID },
      update: {},
      create: {
        id: RESIDENT_ID,
        email: "resident@sunshine-tokyo.jp",
        fullName: "山田 三郎",
        role: "RESIDENT",
        unitId: units[0].id,
      },
    }),
  ]);
  console.log("✅ プロフィール:", [adminProfile, boardProfile, residentProfile].map(p => p.fullName).join(", "));

  // サンプルお知らせ
  const announcements = await Promise.all([
    prisma.announcement.upsert({
      where: { id: "ann-1" },
      update: {},
      create: {
        id: "ann-1",
        title: "2026年度 定期総会のお知らせ",
        content: "2026年5月15日（土）14:00より、A棟集会室にて定期総会を開催いたします。議題：2025年度決算報告、2026年度予算案、役員改選。ご出席できない方は委任状をご提出ください。",
        category: "BOARD",
        priority: "IMPORTANT",
        publishedAt: new Date("2026-03-25"),
        authorId: adminProfile.id,
      },
    }),
    prisma.announcement.upsert({
      where: { id: "ann-2" },
      update: {},
      create: {
        id: "ann-2",
        title: "エレベーター定期点検のお知らせ",
        content: "4月10日（金）9:00〜12:00の間、エレベーターの定期点検を実施いたします。点検中はご利用いただけません。ご不便をおかけしますが、ご理解・ご協力をお願いします。",
        category: "CONSTRUCTION",
        priority: "NORMAL",
        publishedAt: new Date("2026-03-20"),
        authorId: adminProfile.id,
      },
    }),
    prisma.announcement.upsert({
      where: { id: "ann-3" },
      update: {},
      create: {
        id: "ann-3",
        title: "共用廊下の清掃日程変更のお知らせ",
        content: "4月の共用廊下清掃は、業者の都合により4月20日（月）に変更となりました。ご迷惑をおかけして申し訳ございません。",
        category: "GENERAL",
        priority: "NORMAL",
        publishedAt: new Date("2026-03-18"),
        authorId: boardProfile.id,
      },
    }),
  ]);
  console.log(`✅ お知らせ: ${announcements.length}件`);

  // サンプル問い合わせ
  const inquiry = await prisma.inquiry.upsert({
    where: { id: "inq-1" },
    update: {},
    create: {
      id: "inq-1",
      title: "駐輪場の照明が切れています",
      content: "B棟側の駐輪場入口付近の照明が切れており、夜間に危険な状態です。早急に対応をお願いいたします。",
      category: "EQUIPMENT",
      status: "RECEIVED",
      isAnonymous: false,
      submitterId: residentProfile.id,
    },
  });
  console.log("✅ 問い合わせ:", inquiry.title);

  // サンプル書類
  const doc = await prisma.document.upsert({
    where: { id: "doc-1" },
    update: {},
    create: {
      id: "doc-1",
      title: "マンション管理規約（2025年改訂版）",
      category: "RULES",
      fileUrl: "https://example.com/docs/kanri-kiyaku-2025.pdf",
      fileName: "管理規約2025.pdf",
      fileSize: 1024000,
      mimeType: "application/pdf",
      visibility: "ALL_RESIDENTS",
      version: 3,
      description: "2025年4月の定期総会で承認された改訂版管理規約です。",
      uploadedById: adminProfile.id,
    },
  });
  console.log("✅ 書類:", doc.title);

  console.log("\n🎉 シード完了");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
