# マンション管理組合アプリ

マンション管理組合の業務をデジタル化するWebアプリです。
区分所有者（住民）・理事会役員・管理会社の3者間コミュニケーションと業務管理を効率化します。

## デモ（モック）

**https://k7markn.github.io/mansion-kanri-app/**

| ロール | メールアドレス | 利用可能な主な機能 |
|---|---|---|
| 住民 | tanaka@example.com | お知らせ・問い合わせ・施設予約・書類閲覧 |
| 理事（理事長） | sato@example.com | 住民機能 + 会計・設備・総会管理 |
| 管理会社 | yamada@mgmt.co.jp | 全機能 |

---

## 機能一覧

| 機能 | 説明 |
|---|---|
| ダッシュボード | ロール別の統計・お知らせ・会議予定 |
| お知らせ・掲示板 | 管理組合からの通知・住民掲示板 |
| 総会・理事会管理 | 会議の招集・議題・議事録管理 |
| 会計・財務管理 | 収支明細・月次推移・予算vs実績 |
| 修繕・設備管理 | 設備台帳・点検記録・期限アラート |
| 問い合わせ管理 | 住民からの受付・対応状況管理 |
| 共用施設予約 | 集会室・駐車場等の予約カレンダー |
| 書類管理 | 規約・議事録・契約書のドキュメント管理 |
| 投票・アンケート | アンケート作成・回答・集計表示 |

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| DB | Supabase (PostgreSQL) ※Phase 1〜 |
| ORM | Prisma ※Phase 1〜 |
| 認証 | Supabase Auth ※Phase 1〜 |
| ファイル保存 | Supabase Storage ※Phase 1〜 |
| メール通知 | Resend ※Phase 1〜 |
| バリデーション | Zod ※Phase 1〜 |
| ホスティング | Vercel（本番予定）/ GitHub Pages（モック） |

---

## セットアップ

### 必要な環境

- Node.js 20以上
- npm 9以上

### インストールと起動

```bash
git clone https://github.com/k7markn/mansion-kanri-app.git
cd mansion-kanri-app
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

### 環境変数（Phase 1以降）

`.env.local` を作成して以下を設定してください。

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ディレクトリ構成

```
src/
├── app/
│   ├── (app)/              # 認証後の画面（共通サイドバーレイアウト）
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── announcements/  # お知らせ・掲示板
│   │   ├── meetings/       # 総会・理事会管理
│   │   ├── finance/        # 会計・財務管理
│   │   ├── equipment/      # 修繕・設備管理
│   │   ├── inquiries/      # 問い合わせ管理
│   │   ├── reservations/   # 共用施設予約
│   │   ├── documents/      # 書類管理
│   │   └── surveys/        # 投票・アンケート
│   ├── api/                # APIエンドポイント（Route Handlers）
│   └── login/              # ログイン画面
├── components/
│   ├── ui/                 # 汎用UIコンポーネント
│   ├── Sidebar.tsx         # サイドバーナビゲーション
│   └── Header.tsx          # ページヘッダー
├── data/
│   └── mock.ts             # モックデータ（Phase 0のみ）
├── lib/
│   ├── supabase/           # Supabaseクライアント
│   ├── prisma.ts           # Prismaクライアント
│   └── utils.ts            # ユーティリティ関数
└── types/
    └── index.ts            # TypeScript型定義
```

---

## 開発フェーズ

### Phase 0 — モック ✅ 完了
全画面のUIモックをNext.jsで実装。GitHub Pagesで公開済み。

### Phase 1 — MVP（実装中）
認証基盤・住民管理・お知らせ・問い合わせ・書類管理の実機能化。

- [ ] Supabase + Prisma セットアップ
- [ ] 認証（Supabase Auth）
- [ ] 住戸・ユーザー管理
- [ ] お知らせ CRUD + メール通知
- [ ] 問い合わせ管理
- [ ] 書類アップロード（Supabase Storage）

### Phase 2
総会・理事会管理 / 会計・財務管理 / 投票・アンケート

### Phase 3
修繕・設備管理 / 共用施設予約 / 決済連携（Stripe）

### Phase 4
長期修繕計画シミュレーション / 外部システム連携 / 分析レポート

---

## ドキュメント

- [要件定義書](../マンション管理組合アプリ_要件定義書.md)
- [Claude向け開発ガイド](./CLAUDE.md)
