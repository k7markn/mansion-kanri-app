import type {
  User, Unit, Announcement, BulletinPost, Meeting,
  IncomeRecord, ExpenseRecord, BudgetItem, Equipment,
  InspectionRecord, Inquiry, Facility, Reservation,
  Document, Survey, MonthlySummary,
} from "@/types";

// ユーザー
export const mockUsers: User[] = [
  { id: "u1", name: "田中 太郎", email: "tanaka@example.com", role: "resident", unitId: "unit-101", phone: "090-1234-5678", avatarInitials: "田" },
  { id: "u2", name: "佐藤 花子", email: "sato@example.com", role: "board", unitId: "unit-201", position: "理事長", phone: "090-2345-6789", avatarInitials: "佐" },
  { id: "u3", name: "鈴木 次郎", email: "suzuki@example.com", role: "board", unitId: "unit-301", position: "理事", phone: "090-3456-7890", avatarInitials: "鈴" },
  { id: "u4", name: "山田 管理", email: "yamada@mgmt.co.jp", role: "management", unitId: "", phone: "03-1234-5678", avatarInitials: "管" },
];

export const currentUser = mockUsers[1]; // デフォルト: 理事長でログイン

// 住戸
export const mockUnits: Unit[] = [
  { id: "unit-101", building: "A棟", roomNumber: "101", floor: 1, area: 65.2, shareRatio: 1.8, ownerId: "u1" },
  { id: "unit-201", building: "A棟", roomNumber: "201", floor: 2, area: 75.5, shareRatio: 2.1, ownerId: "u2" },
  { id: "unit-301", building: "A棟", roomNumber: "301", floor: 3, area: 82.0, shareRatio: 2.3, ownerId: "u3" },
  { id: "unit-102", building: "A棟", roomNumber: "102", floor: 1, area: 58.0, shareRatio: 1.6, ownerId: "u5" },
  { id: "unit-202", building: "B棟", roomNumber: "201", floor: 2, area: 70.3, shareRatio: 2.0, ownerId: "u6" },
];

// お知らせ
export const mockAnnouncements: Announcement[] = [
  {
    id: "a1", title: "第28回定期総会のご案内", content: "令和7年度定期総会を下記の通り開催いたします。\n\n日時：2026年4月20日（日）14:00〜\n場所：1階集会室\n\n議題：\n1. 令和6年度収支決算報告\n2. 令和7年度事業計画・収支予算案\n3. 管理規約一部改正案\n\n出席できない方は委任状または議決権行使書のご提出をお願いします。",
    category: "board", priority: "important", publishedAt: "2026-03-20", expiresAt: "2026-04-20",
    authorId: "u2", authorName: "佐藤 花子（理事長）", readCount: 45, totalTargets: 60,
  },
  {
    id: "a2", title: "共用廊下・階段の清掃実施について", content: "3月28日（土）9:00〜12:00に共用廊下・階段の高圧洗浄清掃を実施します。当日は清掃エリアの通行にご注意ください。",
    category: "construction", priority: "normal", publishedAt: "2026-03-18",
    authorId: "u4", authorName: "山田 管理（管理会社）", readCount: 38, totalTargets: 60,
  },
  {
    id: "a3", title: "【緊急】エレベーター点検による一時停止のお知らせ", content: "明日3月26日（木）9:00〜11:00にエレベーターの緊急点検を実施します。この間、エレベーターは使用できません。ご不便をおかけしますが、ご理解ご協力のほどよろしくお願いいたします。",
    category: "emergency", priority: "urgent", publishedAt: "2026-03-25",
    authorId: "u4", authorName: "山田 管理（管理会社）", readCount: 52, totalTargets: 60,
  },
  {
    id: "a4", title: "ゴミ出しルールの再確認のお願い", content: "一部の住民の方によるルール違反が見受けられます。以下のルールを再度ご確認ください。\n\n・燃えるゴミ：月・水・金\n・燃えないゴミ：隔週火曜日\n・資源ゴミ：毎週土曜日\n\n収集日以外のゴミ出しは禁止です。",
    category: "general", priority: "normal", publishedAt: "2026-03-15",
    authorId: "u2", authorName: "佐藤 花子（理事長）", readCount: 30, totalTargets: 60,
  },
];

// 掲示板
export const mockBulletinPosts: BulletinPost[] = [
  { id: "b1", title: "子ども乗せ自転車を譲ります", content: "3年ほど使用した子ども乗せ電動自転車を無料で譲ります。メーカー：Panasonic、色：赤。希望の方はメッセージください。", authorName: "305号室", postedAt: "2026-03-24", category: "giveaway", comments: 3 },
  { id: "b2", title: "ペットの里親を探しています", content: "生後6ヶ月のオス猫（茶トラ）の里親を探しています。ワクチン接種済みです。マンションのルール確認の上、ご希望の方はご連絡ください。", authorName: "412号室", postedAt: "2026-03-22", category: "wanted", comments: 7 },
  { id: "b3", title: "防災訓練への参加者募集", content: "4月13日（日）に自主防災訓練を企画中です。参加希望の方は掲示板でお知らせください。", authorName: "201号室", postedAt: "2026-03-20", category: "info", comments: 5 },
];

// 会議
export const mockMeetings: Meeting[] = [
  {
    id: "m1", type: "annual_general", title: "第28回定期総会", date: "2026-04-20", time: "14:00",
    location: "1階集会室", status: "scheduled",
    agendas: ["令和6年度収支決算報告", "令和7年度事業計画・収支予算案", "管理規約一部改正案", "大規模修繕工事計画の承認"],
    totalEligible: 60,
  },
  {
    id: "m2", type: "board", title: "第3回理事会", date: "2026-03-15", time: "19:00",
    location: "1階集会室", status: "completed",
    agendas: ["総会議案の確認", "修繕工事業者選定", "住民からの要望事項"],
    attendeeCount: 7, totalEligible: 8, minutesUrl: "#",
  },
  {
    id: "m3", type: "board", title: "第4回理事会", date: "2026-04-05", time: "19:00",
    location: "1階集会室", status: "scheduled",
    agendas: ["総会最終確認", "共用部修繕の見積もり確認"],
    totalEligible: 8,
  },
  {
    id: "m4", type: "annual_general", title: "第27回定期総会", date: "2025-04-21", time: "14:00",
    location: "1階集会室", status: "completed",
    agendas: ["令和5年度収支決算報告", "令和6年度事業計画・収支予算案"],
    attendeeCount: 48, totalEligible: 60, minutesUrl: "#",
  },
];

// 収入明細（直近3ヶ月分サンプル）
export const mockIncomeRecords: IncomeRecord[] = [
  { id: "i1", unitId: "unit-101", unitLabel: "A棟101号室", type: "management_fee", amount: 18000, targetMonth: "2026-03", status: "paid", paidAt: "2026-03-01" },
  { id: "i2", unitId: "unit-101", unitLabel: "A棟101号室", type: "repair_reserve", amount: 12000, targetMonth: "2026-03", status: "paid", paidAt: "2026-03-01" },
  { id: "i3", unitId: "unit-201", unitLabel: "A棟201号室", type: "management_fee", amount: 21000, targetMonth: "2026-03", status: "paid", paidAt: "2026-03-02" },
  { id: "i4", unitId: "unit-201", unitLabel: "A棟201号室", type: "repair_reserve", amount: 15000, targetMonth: "2026-03", status: "paid", paidAt: "2026-03-02" },
  { id: "i5", unitId: "unit-301", unitLabel: "A棟301号室", type: "management_fee", amount: 23000, targetMonth: "2026-03", status: "unpaid" },
  { id: "i6", unitId: "unit-301", unitLabel: "A棟301号室", type: "repair_reserve", amount: 17000, targetMonth: "2026-03", status: "unpaid" },
  { id: "i7", unitId: "unit-102", unitLabel: "A棟102号室", type: "management_fee", amount: 16000, targetMonth: "2026-03", status: "overdue" },
  { id: "i8", unitId: "unit-202", unitLabel: "B棟201号室", type: "management_fee", amount: 20000, targetMonth: "2026-03", status: "paid", paidAt: "2026-03-05" },
];

// 支出明細
export const mockExpenseRecords: ExpenseRecord[] = [
  { id: "e1", category: "清掃費", amount: 85000, date: "2026-03-20", description: "3月共用部清掃費", vendor: "クリーンサービス(株)", approvalStatus: "approved", approvedBy: "佐藤 花子" },
  { id: "e2", category: "修繕費", amount: 45000, date: "2026-03-15", description: "B棟外壁ひび割れ補修", vendor: "建装工業(株)", approvalStatus: "approved", approvedBy: "佐藤 花子" },
  { id: "e3", category: "設備点検費", amount: 32000, date: "2026-03-10", description: "消防設備定期点検", vendor: "防災テック(株)", approvalStatus: "approved", approvedBy: "佐藤 花子" },
  { id: "e4", category: "管理委託費", amount: 220000, date: "2026-03-01", description: "3月管理委託費", vendor: "山田管理(株)", approvalStatus: "approved", approvedBy: "佐藤 花子" },
  { id: "e5", category: "光熱費", amount: 38500, date: "2026-03-05", description: "共用部電気・水道代", vendor: "東京電力/東京都水道局", approvalStatus: "approved", approvedBy: "佐藤 花子" },
  { id: "e6", category: "修繕費", amount: 120000, date: "2026-03-25", description: "エレベーター内装改修", vendor: "昇降機メンテ(株)", approvalStatus: "pending" },
];

// 予算
export const mockBudgetItems: BudgetItem[] = [
  { id: "b1", category: "管理費収入", budgeted: 1200000, actual: 1125000, type: "income" },
  { id: "b2", category: "修繕積立金収入", budgeted: 900000, actual: 850000, type: "income" },
  { id: "b3", category: "管理委託費", budgeted: 2640000, actual: 660000, type: "expense" },
  { id: "b4", category: "清掃費", budgeted: 1020000, actual: 255000, type: "expense" },
  { id: "b5", category: "設備点検費", budgeted: 480000, actual: 96000, type: "expense" },
  { id: "b6", category: "光熱費", budgeted: 540000, actual: 115500, type: "expense" },
  { id: "b7", category: "修繕費", budgeted: 600000, actual: 165000, type: "expense" },
  { id: "b8", category: "その他管理費", budgeted: 240000, actual: 45000, type: "expense" },
];

// 月次収支
export const mockMonthlySummary: MonthlySummary[] = [
  { month: "2025-10", income: 2050000, expense: 410000, balance: 1640000 },
  { month: "2025-11", income: 2080000, expense: 395000, balance: 1685000 },
  { month: "2025-12", income: 2030000, expense: 520000, balance: 1510000 },
  { month: "2026-01", income: 2100000, expense: 380000, balance: 1720000 },
  { month: "2026-02", income: 2060000, expense: 445000, balance: 1615000 },
  { month: "2026-03", income: 1975000, expense: 540500, balance: 1434500 },
];

// 設備
export const mockEquipment: Equipment[] = [
  { id: "eq1", name: "エレベーター（A棟）", category: "elevator", location: "A棟", installedAt: "2005-03-15", nextInspectionDate: "2026-06-30", manufacturer: "三菱電機", model: "ELENESSA-III", status: "attention" },
  { id: "eq2", name: "エレベーター（B棟）", category: "elevator", location: "B棟", installedAt: "2005-03-15", nextInspectionDate: "2026-06-30", manufacturer: "三菱電機", model: "ELENESSA-III", status: "normal" },
  { id: "eq3", name: "受水槽・高置水槽", category: "plumbing", location: "屋上", installedAt: "2005-03-15", nextInspectionDate: "2026-07-31", manufacturer: "スイドウ工業", model: "SWT-50000", status: "normal" },
  { id: "eq4", name: "自動火災報知設備", category: "fire", location: "全棟", installedAt: "2005-03-15", nextInspectionDate: "2026-04-30", manufacturer: "能美防災", model: "FSD-2000", status: "urgent" },
  { id: "eq5", name: "共用部照明設備", category: "electrical", location: "全棟共用廊下", installedAt: "2018-05-01", nextInspectionDate: "2027-05-31", manufacturer: "東芝", model: "LED-EX", status: "normal" },
  { id: "eq6", name: "宅配ボックス", category: "other", location: "1階エントランス", installedAt: "2020-10-01", nextInspectionDate: "2026-10-31", manufacturer: "フルタイムシステム", model: "SNEO-12", status: "normal" },
];

// 点検記録
export const mockInspectionRecords: InspectionRecord[] = [
  { id: "ir1", equipmentId: "eq1", equipmentName: "エレベーター（A棟）", date: "2025-12-15", vendor: "三菱エレベーター(株)", result: "attention", notes: "ドア開閉動作に若干の異常あり。次回点検時に要確認。" },
  { id: "ir2", equipmentId: "eq3", equipmentName: "受水槽・高置水槽", date: "2025-11-20", vendor: "スイドウ管理(株)", result: "pass", notes: "清掃・水質検査ともに問題なし。" },
  { id: "ir3", equipmentId: "eq4", equipmentName: "自動火災報知設備", date: "2025-10-05", vendor: "能美防災(株)", result: "fail", notes: "3階感知器1個の動作不良を確認。部品交換が必要。" },
  { id: "ir4", equipmentId: "eq2", equipmentName: "エレベーター（B棟）", date: "2025-12-15", vendor: "三菱エレベーター(株)", result: "pass", notes: "異常なし。" },
];

// 問い合わせ
export const mockInquiries: Inquiry[] = [
  { id: "inq1", category: "noise", title: "深夜の騒音について", content: "203号室から毎晩23時以降に大きな足音が聞こえます。以前にも同様の件がありましたが改善されていません。対応をお願いします。", submittedAt: "2026-03-22", submitterName: "田中 太郎", submitterUnit: "A棟103号室", status: "in_progress", assignedTo: "山田 管理", isAnonymous: false },
  { id: "inq2", category: "equipment", title: "1階共用トイレの水漏れ", content: "1階男性トイレの洗面台下から水漏れが発生しています。床が濡れているため早急な対応をお願いします。", submittedAt: "2026-03-24", submitterName: "匿名", submitterUnit: "B棟", status: "open", isAnonymous: true },
  { id: "inq3", category: "facility", title: "集会室の予約システムについて", content: "アプリから集会室の予約をしようとしたところ、エラーが発生しました。操作方法を教えていただけますか？", submittedAt: "2026-03-20", submitterName: "鈴木 次郎", submitterUnit: "A棟301号室", status: "resolved", assignedTo: "山田 管理", resolvedAt: "2026-03-21", isAnonymous: false },
  { id: "inq4", category: "management_fee", title: "管理費の引き落とし日について", content: "来月から引き落とし口座を変更したいのですが、手続き方法を教えてください。", submittedAt: "2026-03-18", submitterName: "高橋 美穂", submitterUnit: "B棟305号室", status: "resolved", assignedTo: "山田 管理", resolvedAt: "2026-03-19", isAnonymous: false },
  { id: "inq5", category: "equipment", title: "駐輪場の照明が切れている", content: "B棟側駐輪場の照明が2箇所切れています。夜間の防犯上問題があるため対応をお願いします。", submittedAt: "2026-03-25", submitterName: "田中 太郎", submitterUnit: "A棟101号室", status: "open", isAnonymous: false },
];

// 施設
export const mockFacilities: Facility[] = [
  { id: "f1", name: "集会室", capacity: 30, pricePerHour: 500, description: "1階集会室。プロジェクター・ホワイトボード完備。最大30名。", availableHours: { start: "09:00", end: "22:00" }, requiresApproval: false },
  { id: "f2", name: "ゲストルーム", capacity: 2, pricePerHour: 1500, description: "2階ゲストルーム。シングルベッド2台。1泊のみ利用可。", availableHours: { start: "15:00", end: "11:00" }, requiresApproval: true },
  { id: "f3", name: "駐車場（来客用）", capacity: 3, pricePerHour: 300, description: "来客用駐車場。最大3台。48時間以内の利用に限る。", availableHours: { start: "00:00", end: "23:59" }, requiresApproval: false },
  { id: "f4", name: "バーベキュースペース", capacity: 20, pricePerHour: 1000, description: "屋上バーベキュースペース。4〜10月のみ利用可。事前申請必須。", availableHours: { start: "11:00", end: "20:00" }, requiresApproval: true },
];

// 予約
export const mockReservations: Reservation[] = [
  { id: "r1", facilityId: "f1", facilityName: "集会室", userId: "u2", userName: "佐藤 花子", unitLabel: "A棟201号室", date: "2026-03-28", startTime: "14:00", endTime: "17:00", status: "confirmed", purpose: "防災委員会会議", fee: 1500 },
  { id: "r2", facilityId: "f1", facilityName: "集会室", userId: "u1", userName: "田中 太郎", unitLabel: "A棟101号室", date: "2026-03-30", startTime: "10:00", endTime: "12:00", status: "confirmed", purpose: "子ども会活動", fee: 1000 },
  { id: "r3", facilityId: "f2", facilityName: "ゲストルーム", userId: "u3", userName: "鈴木 次郎", unitLabel: "A棟301号室", date: "2026-04-05", startTime: "15:00", endTime: "11:00", status: "pending", purpose: "両親来訪", fee: 3000 },
  { id: "r4", facilityId: "f3", facilityName: "駐車場（来客用）", userId: "u1", userName: "田中 太郎", unitLabel: "A棟101号室", date: "2026-04-01", startTime: "10:00", endTime: "18:00", status: "confirmed", purpose: "来客駐車", fee: 2400 },
];

// 書類
export const mockDocuments: Document[] = [
  { id: "d1", title: "管理規約（令和5年度改正版）", category: "regulations", fileSize: "2.4MB", uploadedAt: "2025-04-25", uploadedBy: "佐藤 花子", visibility: "all", version: "1.3", downloadCount: 28 },
  { id: "d2", title: "使用細則", category: "regulations", fileSize: "1.1MB", uploadedAt: "2023-04-20", uploadedBy: "管理事務所", visibility: "all", version: "2.1", downloadCount: 15 },
  { id: "d3", title: "第27回定期総会 議事録", category: "minutes", fileSize: "856KB", uploadedAt: "2025-05-10", uploadedBy: "山田 管理", visibility: "all", version: "1.0", downloadCount: 22 },
  { id: "d4", title: "第28回定期総会 招集通知・議案書", category: "general_meeting", fileSize: "1.8MB", uploadedAt: "2026-03-20", uploadedBy: "佐藤 花子", visibility: "all", version: "1.0", downloadCount: 45 },
  { id: "d5", title: "管理委託契約書（R6年度）", category: "contract", fileSize: "3.2MB", uploadedAt: "2025-04-01", uploadedBy: "山田 管理", visibility: "board", version: "1.0", downloadCount: 8 },
  { id: "d6", title: "建物竣工図面（A棟）", category: "floor_plan", fileSize: "12.5MB", uploadedAt: "2021-03-01", uploadedBy: "管理事務所", visibility: "management", version: "1.0", downloadCount: 3 },
  { id: "d7", title: "大規模修繕計画書（第2回）", category: "other", fileSize: "4.7MB", uploadedAt: "2024-10-15", uploadedBy: "山田 管理", visibility: "board", version: "2.0", downloadCount: 12 },
];

// アンケート
export const mockSurveys: Survey[] = [
  { id: "s1", title: "第28回総会 意見募集", description: "定期総会の議案に関するご意見をお聞かせください。", startDate: "2026-03-20", endDate: "2026-04-10", status: "active", responseCount: 32, totalTargets: 60, isAnonymous: true },
  { id: "s2", title: "共用部リニューアルに関するアンケート", description: "エントランスホールおよびエレベーターホールのリニューアルについてご意見をお聞かせください。", startDate: "2026-03-01", endDate: "2026-03-31", status: "active", responseCount: 28, totalTargets: 60, isAnonymous: true },
  { id: "s3", title: "2025年度 管理会社サービス満足度調査", description: "管理会社へのサービス満足度についてお答えください。", startDate: "2026-01-15", endDate: "2026-02-15", status: "closed", responseCount: 41, totalTargets: 60, isAnonymous: true },
];

// ダッシュボード用統計
export const dashboardStats = {
  totalUnits: 60,
  occupiedUnits: 57,
  managementFeeCollectionRate: 96.7,
  repairReserveBalance: 28450000,
  managementFeeBalance: 3240000,
  openInquiries: 2,
  upcomingMeetings: 2,
  overduePayments: 3,
  nextInspectionDue: "自動火災報知設備（2026-04-30）",
};
