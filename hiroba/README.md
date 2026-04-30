# HIROBA — 自治体の隠れた宝を発見する

市区町村が運営する、安心・低料金で利用できる施設を全国からビジュアルで発見できるSNSアプリです。

## コンセプト

自治体が運営する温泉・キャンプ場・スポーツ施設・文化施設・宿泊施設など、
地元の人しか知らない「公共の宝」が日本中にあります。

**HIROBA** は、それらをビジュアルで一覧できる、お気に入り登録ができる、
「行こう」と思った時にすぐアクセスできる場所です。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS v4
- **認証**: Clerk
- **データベース**: Supabase
- **言語**: TypeScript

## 開発環境の起動

```bash
npm install
npm run dev
```

## 環境変数

`.env.local.example` を `.env.local` にコピーし、値を埋めてください。埋めたあと `npm run check:env` で必須項目の有無を確認できます。

Clerk ダッシュボード側の設定（リダイレクト許可・ユーザーの Public metadata など）は `.env.local.example` 末尾のチェックリストと `docs/ROLES_AND_OPERATORS.md` を参照してください。

広場専用の Supabase プロジェクトを使う手順は `SUPABASE_SETUP.md` を参照してください。

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```
