# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイドです。

---

## プロジェクト概要

**サンシャイン東京マンション 管理組合向けWebアプリ**

マンション管理組合の業務（会計・総会・修繕・問い合わせ等）をデジタル化するWebアプリ。
区分所有者（住民）・理事会役員・管理会社の3ロールが利用する。

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript（strict モード） |
| スタイリング | Tailwind CSS |
| アイコン | Lucide React |
| DB | Supabase (PostgreSQL) |
| ORM | Prisma 7（prisma-client-js + @prisma/adapter-pg） |
| 認証 | Supabase Auth + @supabase/ssr |
| ファイル保存 | Supabase Storage（Phase 2〜） |
| メール通知 | Resend（Phase 2〜） |
| バリデーション | Zod |
| ホスティング | Vercel（本番予定） |

---

## ディレクトリ構成

```
src/
├── app/
│   ├── (app)/              # 認証後の画面（共通サイドバーレイアウト）
│   │   ├── layout.tsx      # サイドバー付きレイアウト（Supabase Auth チェック）
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── announcements/  # お知らせ・掲示板
│   │   ├── inquiries/      # 問い合わせ管理
│   │   ├── documents/      # 書類管理
│   │   ├── units/          # 住戸・住民管理（理事以上）
│   │   ├── meetings/       # 総会・理事会管理（Phase 2〜）
│   │   ├── finance/        # 会計・財務管理（Phase 2〜）
│   │   ├── equipment/      # 修繕・設備管理（Phase 3〜）
│   │   ├── reservations/   # 共用施設予約（Phase 3〜）
│   │   └── surveys/        # 投票・アンケート（Phase 2〜）
│   ├── actions/            # Server Actions（auth.ts）
│   ├── api/                # Route Handlers
│   │   ├── announcements/
│   │   ├── inquiries/
│   │   ├── documents/
│   │   └── units/
│   └── login/              # ログイン画面
├── components/
│   ├── Sidebar.tsx         # サイドバーナビゲーション（profile props受け取り）
│   └── Header.tsx          # ページヘッダー
├── data/
│   └── mock.ts             # Phase 0 モックデータ（Phase 2以降のUI参考用）
├── generated/
│   └── prisma/             # Prismaクライアント生成物（git管理外）
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # ブラウザ用 Supabase クライアント
│   │   └── server.ts       # サーバー用 Supabase クライアント（cookies使用）
│   ├── prisma.ts           # Prismaクライアント シングルトン
│   └── utils.ts            # 汎用ユーティリティ（cn関数等）
└── types/
    └── index.ts            # 共通TypeScript型定義（Phase 0 モック用）
```

---

## 主要コマンド

```bash
npm run dev                          # 開発サーバー起動（http://localhost:3000）
npm run build                        # 本番ビルド
npm run lint                         # ESLint 実行
npx prisma generate                  # Prismaクライアント型生成
npx prisma migrate dev --name <name> # DBマイグレーション作成・適用
npx tsx prisma/seed.ts               # シードデータ投入
npx prisma studio                    # Prisma Studio（DBビューワー）起動
```

---

## Prisma / DB 接続の仕組み

Prisma 7 では組み込みDB接続エンジンが廃止されたため、ドライバーアダプターが必要。

| 用途 | 接続先 | 環境変数 |
|---|---|---|
| アプリのクエリ | Transaction Pooler（port 6543） | `DATABASE_URL` |
| マイグレーション | Session Pooler（port 5432） | `DIRECT_URL` |

- `src/lib/prisma.ts` → `DATABASE_URL` + `@prisma/adapter-pg` でクライアント生成
- `prisma.config.ts` → `DIRECT_URL` を migrate コマンドに使用（dotenv/config で .env 読み込み）

---

## ユーザーロールと権限

| ロール | 値 | 説明 | アクセス可能な主な機能 |
|---|---|---|---|
| 住民 | `RESIDENT` | 区分所有者・居住者 | お知らせ閲覧、問い合わせ送信、書類閲覧 |
| 理事 | `BOARD` | 理事長・理事・監事 | 住民機能 + 住戸管理・問い合わせ対応・お知らせ投稿 |
| 管理会社 | `MANAGEMENT` | 管理会社スタッフ | 理事機能 + 全住戸管理・マスタ管理 |
| 管理者 | `ADMIN` | システム管理者 | 全機能 |

---

## コーディング規約

### 全般
- TypeScript strict モードを維持する（`any` は原則禁止）
- コンポーネントは関数コンポーネントで統一
- `"use client"` は必要最小限のコンポーネントにのみ付与する
- Server Components を優先し、インタラクティブな部分のみ Client Components にする

### ページ構成パターン
- `page.tsx` → Server Component（Supabase Auth + Prisma でデータ取得）
- `XxxClient.tsx` → Client Component（インタラクション担当）

### ファイル・命名
- コンポーネントファイル: PascalCase（例: `AnnouncementCard.tsx`）
- ユーティリティ・フック: camelCase（例: `useAnnouncements.ts`）
- ルートディレクトリ: kebab-case（例: `announcements/`）

### スタイリング
- クラス結合には必ず `cn()` ユーティリティ（`src/lib/utils.ts`）を使う
- インラインスタイル（`style=` 属性）は原則使用しない
- レスポンシブはモバイルファーストで記述する（`sm:` `md:` `lg:` の順）

### API（Route Handlers）
- `src/app/api/` 以下に機能別ディレクトリで配置
- リクエスト・レスポンスの型は Zod スキーマで定義する
- エラーレスポンスは統一フォーマット `{ error: string }` を使う
- 認証が必要なエンドポイントは必ず Supabase Auth でセッションを検証する

### DB・Prisma
- スキーマ変更は必ずマイグレーションファイルを生成する（直接DB変更は禁止）
- リレーション名・フィールド名は camelCase
- テーブル名は snake_case（Prismaの `@map` で対応）
- 日時フィールドは UTC で保存する

---

## 環境変数

`.env.example` を参照。実際の値は `.env`（Prisma CLI用）と `.env.local`（Next.js用）に設定する。

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # サーバーサイド専用（クライアントに露出禁止）

# Database（Prisma）
DATABASE_URL=                   # Transaction Pooler (port 6543) - アプリ用
DIRECT_URL=                     # Session Pooler (port 5432) - マイグレーション用

# メール（Resend）Phase 2〜
RESEND_API_KEY=

# アプリURL
NEXT_PUBLIC_APP_URL=
```

---

## 現在の状態（Phase 1 完了）

### 実装済み機能
- Supabase Auth によるログイン・ログアウト・セッション管理
- ミドルウェアによる認証保護（未ログインは `/login` にリダイレクト）
- ロール別ナビゲーション（RESIDENT / BOARD / MANAGEMENT / ADMIN）
- ダッシュボード（リアルデータ表示）
- お知らせ・掲示板（CRUD・カテゴリフィルター・既読管理）
- 問い合わせ管理（投稿・匿名・ステータス更新）
- 書類管理（一覧・検索・権限別フィルター）
- 住戸・住民管理（理事以上）

### 残課題（Phase 2以降）
- 総会・理事会管理、会計・財務管理、投票・アンケート（Phase 2）
- 修繕・設備管理、共用施設予約（Phase 3）
- Supabase Storage によるファイルアップロード
- Resend によるメール通知

---

## 関連ドキュメント

- 要件定義書: `マンション管理組合アプリ_要件定義書.md`（リポジトリルートの一つ上）
- GitHub リポジトリ: https://github.com/k7markn/mansion-kanri-app
