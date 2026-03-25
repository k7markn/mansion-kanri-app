// ユーザーロール
export type UserRole = "resident" | "board" | "management" | "admin";

// ユーザー
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unitId: string;
  position?: string; // 理事長・理事など
  phone?: string;
  avatarInitials: string;
}

// 住戸
export interface Unit {
  id: string;
  building: string;
  roomNumber: string;
  floor: number;
  area: number; // 専有面積 m²
  shareRatio: number; // 持分割合 %
  ownerId: string;
  residentId?: string;
}

// お知らせカテゴリ
export type AnnouncementCategory =
  | "board"
  | "construction"
  | "emergency"
  | "general";

// 重要度
export type Priority = "normal" | "important" | "urgent";

// お知らせ
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: Priority;
  publishedAt: string;
  expiresAt?: string;
  authorId: string;
  authorName: string;
  readCount: number;
  totalTargets: number;
}

// 掲示板投稿
export interface BulletinPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  postedAt: string;
  category: "info" | "wanted" | "giveaway" | "other";
  comments: number;
}

// 会議種別
export type MeetingType =
  | "annual_general"
  | "extraordinary_general"
  | "board"
  | "extraordinary_board";

// 会議状態
export type MeetingStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

// 会議
export interface Meeting {
  id: string;
  type: MeetingType;
  title: string;
  date: string;
  time: string;
  location: string;
  status: MeetingStatus;
  agendas: string[];
  attendeeCount?: number;
  totalEligible?: number;
  minutesUrl?: string;
}

// 収入種別
export type IncomeType = "management_fee" | "repair_reserve" | "special" | "other";

// 支払い状態
export type PaymentStatus = "paid" | "unpaid" | "partial" | "overdue";

// 収入明細
export interface IncomeRecord {
  id: string;
  unitId: string;
  unitLabel: string;
  type: IncomeType;
  amount: number;
  targetMonth: string; // YYYY-MM
  status: PaymentStatus;
  paidAt?: string;
}

// 支出明細
export interface ExpenseRecord {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  vendor: string;
  approvalStatus: "pending" | "approved" | "rejected";
  approvedBy?: string;
}

// 予算項目
export interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  type: "income" | "expense";
}

// 設備種別
export type EquipmentCategory =
  | "electrical"
  | "plumbing"
  | "fire"
  | "elevator"
  | "exterior"
  | "other";

// 設備
export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  location: string;
  installedAt: string;
  nextInspectionDate: string;
  manufacturer: string;
  model: string;
  status: "normal" | "attention" | "urgent";
}

// 点検記録
export interface InspectionRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  vendor: string;
  result: "pass" | "attention" | "fail";
  notes: string;
}

// 問い合わせカテゴリ
export type InquiryCategory =
  | "equipment"
  | "noise"
  | "facility"
  | "management_fee"
  | "other";

// 問い合わせ状態
export type InquiryStatus = "open" | "in_progress" | "resolved" | "pending";

// 問い合わせ
export interface Inquiry {
  id: string;
  category: InquiryCategory;
  title: string;
  content: string;
  submittedAt: string;
  submitterName: string;
  submitterUnit: string;
  status: InquiryStatus;
  assignedTo?: string;
  resolvedAt?: string;
  isAnonymous: boolean;
}

// 施設
export interface Facility {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
  availableHours: { start: string; end: string };
  requiresApproval: boolean;
}

// 予約状態
export type ReservationStatus = "confirmed" | "pending" | "cancelled";

// 予約
export interface Reservation {
  id: string;
  facilityId: string;
  facilityName: string;
  userId: string;
  userName: string;
  unitLabel: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  purpose: string;
  fee: number;
}

// 書類カテゴリ
export type DocumentCategory =
  | "regulations"
  | "minutes"
  | "general_meeting"
  | "contract"
  | "floor_plan"
  | "other";

// 書類
export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  visibility: "all" | "board" | "management";
  version: string;
  downloadCount: number;
}

// アンケート
export interface Survey {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "closed" | "draft";
  responseCount: number;
  totalTargets: number;
  isAnonymous: boolean;
}

// 月次サマリ
export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
