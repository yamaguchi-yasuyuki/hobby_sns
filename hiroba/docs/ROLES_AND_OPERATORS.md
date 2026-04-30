# 広場（HIROBA）— 利用者区分と運営者（マスターアドミン）

## 利用者区分（`account_kind`）

| 値 | 想定ユーザー | 説明 |
|----|--------------|------|
| `general` | パパ・ママ等 | 施設を見る・お気に入りする（デフォルト） |
| `municipality_staff` | 自治体職員等 | 施設情報の登録・更新（将来の自治体向け機能） |
| `platform_operator` | 広場の運営者 | マスターアドミン。全体設定・横断的な運用（**複数人可**） |

DB の `public.users.account_kind` と、ログイン時に Clerk から同期します。

## 運営者は専用アカウントで運用する（推奨・運用ルール）

**運営者（`platform_operator`）は、個人の普段使いアカウントではなく、組織が発行した専用アカウントで Clerk に登録する。** 例: `hiroba-ops@example.org` のような運営用メール、または運営用の Google アカウントでサインアップ／SSO する。

- **理由**: 退職・異動時の引き継ぎ、監査、誤って個人メールに権限が残るリスクの低減。
- **Google 連携**: 専用 Google アカウントで「Google で続ける」を使えばよい（Clerk 側の仕様変更は不要）。
- アプリは「どのメールか」ではなく **`hirobaAccountKind: "platform_operator"`** で権限を判定する。メールドメイン制限をコードで入れたくなったら、別途環境変数や Clerk の Allowlist で足す。

## 運営者の登録の仕方（いまは1人からでよい）

1. **運営用の専用アカウント**で [Clerk のサインアップ／招待](https://dashboard.clerk.com) からユーザー登録する（上記ルール）。
2. [Clerk Dashboard](https://dashboard.clerk.com) → 該当ユーザー → **User metadata → Public metadata** に次を設定する：

```json
{
  "hirobaAccountKind": "platform_operator"
}
```

3. 広場に再度ログインすると、`ensureSupabaseUser()` が Supabase の `users.account_kind` を `platform_operator` に更新する。
4. **運営者コンソール**（仮）: `/admin/platform`（`platform_operator` のみアクセス可）

### 運営者の専用ログイン URL

| 用途 | URL | ログイン後（既定） |
|------|-----|-------------------|
| 運営者サインイン | `/sign-in/operator` | `/admin/platform` |
| 運営者サインアップ（初回） | `/sign-up/operator` | 同上 |

一般ユーザー向けの `/sign-in` はそのまま。未ログインで `/admin/platform` に入ると **`/sign-in/operator` にリダイレクト**されます。

**Clerk**: Google 連携を有効にし、リダイレクト URL を制限している場合は **`/sign-in/operator`・`/sign-up/operator`**（および本番ドメイン付きの同等 URL）を許可リストに追加してください。

## 自治体職員（情報登録側）

1. **組織から案内する専用アカウント**で Clerk に登録する（運営者と同様の考え方）。
2. Public metadata:

```json
{
  "hirobaAccountKind": "municipality_staff"
}
```

3. 再ログイン後、`users.account_kind` が `municipality_staff` に同期される。
4. **登録者コンソール**: `/admin/municipality`（画面設計: `docs/MUNICIPALITY_ADMIN_UI.md`、施設一覧は `/admin/municipality/facilities`）

### 登録者向け専用ログイン URL

| 用途 | URL | ログイン後（既定） |
|------|-----|-------------------|
| 登録者サインイン | `/sign-in/staff` | `/admin/municipality` |
| 登録者サインアップ（初回） | `/sign-up/staff` | 同上 |

未ログインで `/admin/municipality` に入ると **`/sign-in/staff` にリダイレクト**されます。Clerk の許可 URL に **`/sign-in/staff`・`/sign-up/staff`** も追加してください。

**ログインできない・すぐトップに戻るとき**: アプリ側は専用サインインを **hash ルーティング**にしてあり、ダッシュボードの「サインイン URL」が `/sign-in` だけでも動きやすくしています。それでも失敗する場合は **Allowed redirect origins** に `http://localhost:3000`（実際のポート）を入れ、**Google 連携を有効**にしてください。ログイン後に管理画面に入れない場合は、ほぼ確実に **Public metadata に `hirobaAccountKind: "municipality_staff"` が未設定**です。未設定のままだと `/sign-in/staff` に戻り「別アカウントでログアウト」の案内が出ます。

## 複数運営者に増やすとき

- 上記と同じく、**別の運営専用 Clerk ユーザー**に `hirobaAccountKind: "platform_operator"` を付与するだけ。
- 行数は増えるが、**同じ権限モデル**のまま分担できる（役割の細分化が必要になったら別途 `operator_roles` テーブル等を検討）。

## セキュリティメモ

- `publicMetadata` は **Clerk ダッシュボードまたはバックエンド API** からのみ変更する運用にすること（利用者が自分で昇格できないようにする）。
- 将来、運営者が運営者を招待する UI を作る場合は **Server Action + 既存運営者チェック + Clerk Backend API** でメタデータを更新する。

## マイグレーション

- 初回: `20260427000001_create_initial_schema.sql`
- 種別列追加: `20260428000002_add_account_kind.sql`（Supabase SQL Editor で実行）
