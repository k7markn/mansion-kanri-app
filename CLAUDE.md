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
| DB | Supabase (PostgreSQL) ※Phase 1〜 |
| ORM | Prisma ※Phase 1〜 |
| 認証 | Supabase Auth ※Phase 1〜 |
| ファイル保存 | Supabase Storage ※Phase 1〜 |
| メール通知 | Resend ※Phase 1〜 |
| バリデーション | Zod ※Phase 1〜 |
| ホスティング | Vercel（本番）/ GitHub Pages（モック） |

---

## ディレクトリ構成

```
src/
├── app/
│   ├── (app)/              # 認証後の画面（共通サイドバーレイアウト）
│   │   ├── layout.tsx      # サイドバー付きレイアウト
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── announcements/  # お知らせ・掲示板
│   │   ├── meetings/       # 総会・理事会管理
│   │   ├── finance/        # 会計・財務管理
│   │   ├── equipment/      # 修繕・設備管理
│   │   ├── inquiries/      # 問い合わせ管理
│   │   ├── reservations/   # 共用施設予約
│   │   ├── documents/      # 書類管理
│   │   └── surveys/        # 投票・アンケート
│   ├── api/                # Route Handlers（APIエンドポイント）※Phase 1〜
│   └── login/              # ログイン画面
├── components/
│   ├── ui/                 # 汎用UIコンポーネント
│   ├── Sidebar.tsx         # サイドバーナビゲーション
│   └── Header.tsx          # ページヘッダー
├── data/
│   └── mock.ts             # モックデータ（Phase 0のみ）
├── lib/
│   ├── supabase/           # Supabaseクライアント ※Phase 1〜
│   ├── prisma.ts           # Prismaクライアント ※Phase 1〜
│   └── utils.ts            # 汎用ユーティリティ（cn関数等）
├── types/
│   └── index.ts            # 共通TypeScript型定義
└── hooks/                  # カスタムReact Hooks ※Phase 1〜
```

---

## 主要コマンド

```bash
npm run dev          # 開発サーバー起動（http://localhost:3000）
npm run build        # 本番ビルド（静的エクスポート）
npm run lint         # ESLint 実行
npx prisma generate  # Prismaクライアント型生成
npx prisma migrate dev --name <name>  # DBマイグレーション作成・適用
npx prisma studio    # Prisma Studio（DBビューワー）起動
```

---

## ユーザーロールと権限

| ロール | 値 | 説明 | アクセス可能な主な機能 |
|---|---|---|---|
| 住民 | `resident` | 区分所有者・居住者 | お知らせ閲覧、問い合わせ、施設予約、書類閲覧 |
| 理事 | `board` | 理事長・理事・監事 | 住民機能 + 会計・設備・総会管理 |
| 管理会社 | `management` | 管理会社スタッフ | 理事機能 + 全住戸管理・マスタ管理 |
| 管理者 | `admin` | システム管理者 | 全機能 + テナント管理 |

---

## コーディング規約

### 全般
- TypeScript strict モードを維持する（`any` は原則禁止）
- コンポーネントは関数コンポーネント（`function` 宣言）で統一
- `"use client"` は必要最小限のコンポーネントにのみ付与する
- Server Components を優先し、インタラクティブな部分のみ Client Components にする

### ファイル・命名
- コンポーネントファイル: PascalCase（例: `AnnouncementCard.tsx`）
- ユーティリティ・フック: camelCase（例: `useAnnouncements.ts`）
- ルートディレクトリ: kebab-case（例: `announcements/`）
- 型定義は `src/types/index.ts` に集約するか、機能単位で `types.ts` を置く

### スタイリング
- クラス結合には必ず `cn()` ユーティリティ（`src/lib/utils.ts`）を使う
- インラインスタイル（`style=` 属性）は原則使用しない
- レスポンシブはモバイルファーストで記述する（`sm:` `md:` `lg:` の順）

### API（Route Handlers）
- `src/app/api/` 以下に機能別ディレクトリで配置
- リクエスト・レスポンスの型は Zod スキーマで定義する
- エラーレスポンスは統一フォーマット `{ error: string, code?: string }` を使う
- 認証が必要なエンドポイントは必ず Supabase Auth でセッションを検証する

### DB・Prisma
- スキーマ変更は必ずマイグレーションファイルを生成する（直接DB変更は禁止）
- リレーション名・フィールド名は camelCase
- テーブル名は snake_case（Prismaの `@map` で対応）
- 日時フィールドは UTC で保存する

---

## 環境変数

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # サーバーサイド専用（クライアントに露出禁止）

# Database（Prisma）
DATABASE_URL=
DIRECT_URL=                     # Supabase connection pooling 用

# メール（Resend）
RESEND_API_KEY=

# アプリ
NEXT_PUBLIC_APP_URL=
```

---

## 現在の状態（Phase 0）

- モック実装済み。すべてのデータは `src/data/mock.ts` のインメモリデータ
- 認証は見た目のみ（実際の認証なし）
- GitHub Pages にデプロイ済み: https://k7markn.github.io/mansion-kanri-app/

Phase 1 実装時は以下の変更が必要：
1. `src/data/mock.ts` のデータを Supabase + Prisma に置き換え
2. `src/app/login/page.tsx` の認証処理を Supabase Auth に接続
3. `currentUser` の参照をセッション取得に変更
4. `next.config.ts` の `output: "export"` を削除（SSR/SSG 使用時）
5. ホスティングを GitHub Pages → Vercel に移行

---

## 関連ドキュメント

- 要件定義書: `マンション管理組合アプリ_要件定義書.md`（リポジトリルートの一つ上）
- GitHub リポジトリ: https://github.com/k7markn/mansion-kanri-app
- モックデモ: https://k7markn.github.io/mansion-kanri-app/
