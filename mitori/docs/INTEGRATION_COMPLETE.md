# ✅ Supabase + Clerk 統合完了レポート

実装日: 2026-04-24

## 📦 インストールされたパッケージ

- @clerk/nextjs: latest
- @supabase/supabase-js: latest
- @supabase/ssr: latest

## 🗂️ 作成・変更されたファイル

### 新規作成
| ファイル | 説明 |
|---------|------|
| `middleware.ts` | clerkMiddleware（/collection, /settings, /admin を保護） |
| `.env.local.example` | 環境変数テンプレート |
| `src/lib/supabase/client.ts` | ブラウザ用 Supabase クライアント |
| `src/lib/supabase/server.ts` | サーバー用 Supabase クライアント |
| `src/lib/supabase/service-role.ts` | Service Role クライアント（サーバー専用） |
| `src/lib/supabase/types.ts` | TypeScript 型定義 |
| `src/lib/supabase/auth-helpers.ts` | ensureSupabaseUser / getSupabaseUserByClerkId |
| `src/actions/bookmark.ts` | ブックマーク Server Actions |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Clerk サインインページ |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Clerk サインアップページ |
| `supabase/migrations/20260424000001_create_initial_schema.sql` | 初期スキーマ + RLS |

### 変更
| ファイル | 変更内容 |
|---------|---------|
| `src/app/layout.tsx` | ClerkProvider 追加、AuthProvider 削除 |
| `src/components/layout/Header.tsx` | useAuth → useUser/useClerk (Clerk) |
| `src/components/content/BookmarkButton.tsx` | useAuth → useUser (Clerk) |
| `src/app/collection/page.tsx` | useAuth → useUser (Clerk) |
| `next.config.ts` | turbopack.root 設定追加 |

## 🗄️ データベース構造

### テーブル（5個）
| テーブル | 説明 | RLS |
|---------|------|-----|
| `users` | Clerk ユーザーと紐づくアプリユーザー | 本人のみ SELECT/INSERT |
| `genres` | 趣味ジャンルマスター | なし（全員閲覧可） |
| `contents` | キュレーションコンテンツ | published は全員、admin は全操作 |
| `bookmarks` | ユーザーの気になる保存 | 本人のみ SELECT/INSERT/DELETE |
| `user_genre_preferences` | ジャンル設定 | 本人のみ SELECT/INSERT/DELETE |

## 📝 次のステップ（ユーザー作業）

### ステップ 1: Clerk の設定
1. https://dashboard.clerk.com/ でプロジェクト作成
2. Google OAuth を有効化（Configure → SSO Connections → Google）
3. API Keys を取得（`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`）
4. Paths 設定：Sign-in `/sign-in`、Sign-up `/sign-up`、After `/`

### ステップ 2: Supabase の設定
1. https://supabase.com/dashboard でプロジェクト作成
2. Settings → API から URL・anon key・service_role key を取得
3. SQL Editor で `supabase/migrations/20260424000001_create_initial_schema.sql` を実行

### ステップ 3: 環境変数の設定
```bash
# .env.local.example を .env.local にコピーして値を入力
cp .env.local.example .env.local
```

### ステップ 4: 動作確認
```bash
npm run dev
# → http://localhost:3000 でサインアップ → ログインを確認
```
