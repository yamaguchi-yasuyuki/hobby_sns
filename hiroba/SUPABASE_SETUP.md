# HIROBA 専用 Supabase のセットアップ

見取り（mitori）と DB を分けたいときの手順です。

## 1. Supabase で広場専用プロジェクトを作る

1. [Supabase Dashboard](https://supabase.com/dashboard) → **New project**
2. プロジェクト名例: `hiroba`（任意）
3. リージョン・DB パスワードを設定し、作成完了を待つ

## 2. API キーを取得

**Settings → API**

| 環境変数 | コピー元 |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key（または `anon` `public`） |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role`（秘密） |

## 3. 広場の `.env.local` を差し替える

```bash
cd hiroba
cp .env.local.example .env.local
```

`.env.local` を開き、**上記はすべて広場用プロジェクトの値**にする。  
見取り用の URL が残っていると、広場から見取りの DB に繋がります。

## 4. マイグレーションを実行

**SQL Editor → New query** に、次を**この順番で**貼り付けてそれぞれ **Run**：

1. `supabase/migrations/20260427000001_create_initial_schema.sql`
2. `supabase/migrations/20260428000002_add_account_kind.sql`（利用者区分・運営者用）

（1 は空のプロジェクトに対して 1 回。2 は 1 実行済みのプロジェクトに追加で 1 回。）

## 5. 開発サーバー再起動

```bash
npm run dev
```

ログイン後、Table Editor の `users` に行が追加されれば成功です。

## トラブルシュート

- **社内プロキシ（Cato 等）で TLS エラー**  
  `package.json` の `dev` スクリプトに `NODE_TLS_REJECT_UNAUTHORIZED=0` が入っている場合は開発時のみ緩和されます。本番では使いません。
- **Clerk のユーザーは Supabase に出ない**  
  トップページ表示時に `getBookmarkIdsAction` が走り `ensureSupabaseUser` が呼ばれます。`middleware.ts` は `src/middleware.ts` にあることを確認してください。
