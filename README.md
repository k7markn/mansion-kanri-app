# マンション管理組合アプリ

マンション管理組合の業務をデジタル化するWebアプリです。
区分所有者（住民）・理事会役員・管理会社の3者間コミュニケーションと業務管理を効率化します。

---

## 機能一覧

| 機能 | Phase 1 | Phase 2 | Phase 3 |
|---|:---:|:---:|:---:|
| ログイン・認証（Supabase Auth） | ✅ | | |
| ダッシュボード | ✅ | | |
| お知らせ・掲示板 | ✅ | | |
| 問い合わせ管理 | ✅ | | |
| 書類管理 | ✅ | | |
| 住戸・住民管理 | ✅ | | |
| 総会・理事会管理 | | 🔜 | |
| 会計・財務管理 | | 🔜 | |
| 投票・アンケート | | 🔜 | |
| 修繕・設備管理 | | | 🔜 |
| 共用施設予約 | | | 🔜 |
| 決済連携（Stripe） | | | 🔜 |

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript（strict） |
| スタイリング | Tailwind CSS |
| DB | Supabase (PostgreSQL) |
| ORM | Prisma 7 + @prisma/adapter-pg |
| 認証 | Supabase Auth + @supabase/ssr |
| ファイル保存 | Supabase Storage（Phase 2〜） |
| メール通知 | Resend（Phase 2〜） |
| バリデーション | Zod |
| ホスティング | Vercel |

---

## ローカル開発セットアップ

### 必要な環境

- Node.js 20以上
- Supabase アカウント（[supabase.com](https://supabase.com)）

### 1. クローン & インストール

```bash
git clone https://github.com/k7markn/mansion-kanri-app.git
cd mansion-kanri-app
npm install
```

### 2. Supabase プロジェクト作成

[Supabase ダッシュボード](https://supabase.com)でプロジェクトを作成し、以下の値を取得します。

- **Settings → API**: Project URL、anon key、service_role key
- **Settings → Database → Connection string**:
  - Transaction pooler（port 6543）→ `DATABASE_URL`
  - Session pooler（port 5432）→ `DIRECT_URL`

### 3. 環境変数の設定

`.env.example` を参考に2つのファイルを作成します。

**`.env.local`**（Next.js アプリ用）
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres.your-project:password@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.your-project:password@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**`.env`**（Prisma CLI用）
```bash
DATABASE_URL=...  # 上記と同じ値
DIRECT_URL=...    # 上記と同じ値
SEED_ADMIN_ID=    # 手順5で設定
SEED_BOARD_ID=    # 手順5で設定
SEED_RESIDENT_ID= # 手順5で設定
```

### 4. DBマイグレーション & クライアント生成

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. テストユーザーの作成

Supabase ダッシュボード **Authentication → Users → Add user** でユーザーを作成し、
発行された UUID を `.env` の `SEED_*` 変数に設定します。

| メール | ロール |
|---|---|
| admin@example.com | 理事長（BOARD） |
| board@example.com | 理事（BOARD） |
| resident@example.com | 住民（RESIDENT） |

### 6. シードデータ投入

```bash
npx tsx prisma/seed.ts
```

### 7. 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## ユーザーロール

| ロール | 説明 | 主な権限 |
|---|---|---|
| `RESIDENT`（住民） | 区分所有者・居住者 | お知らせ閲覧・問い合わせ送信・書類閲覧 |
| `BOARD`（理事会） | 理事長・理事・監事 | 住民機能 + 住戸管理・問い合わせ対応・お知らせ投稿 |
| `MANAGEMENT`（管理会社） | 管理会社スタッフ | 理事機能 + 全住戸管理・マスタ管理 |
| `ADMIN`（管理者） | システム管理者 | 全機能 |

---

## 開発フェーズ

### Phase 0 — モック ✅ 完了
全画面のUIモックをNext.jsで実装。

### Phase 1 — MVP ✅ 完了
Supabase Auth・DB連携による実機能化。

- [x] Supabase + Prisma セットアップ
- [x] 認証（Supabase Auth・ミドルウェア）
- [x] 住戸・ユーザー管理
- [x] お知らせ・掲示板（CRUD・既読管理）
- [x] 問い合わせ管理（匿名・ステータス管理）
- [x] 書類管理（権限別フィルター）

### Phase 2 — 予定
- [ ] 総会・理事会管理（招集通知・電子投票）
- [ ] 会計・財務管理（収支記録・レポート）
- [ ] 投票・アンケート
- [ ] メール通知（Resend）
- [ ] ファイルアップロード（Supabase Storage）

### Phase 3 — 予定
- [ ] 修繕・設備管理
- [ ] 共用施設予約
- [ ] 決済連携（Stripe）

---

## ドキュメント

- [要件定義書](../マンション管理組合アプリ_要件定義書.md)
- [Claude向け開発ガイド](./CLAUDE.md)
- [環境変数テンプレート](./.env.example)
