# API仕様書 - MITORI

---

## 1. 設計原則

- **実装方式：** Next.js App Router の API Routes（`app/api/`）および Server Actions
- **形式：** RESTful API（JSON）
- **ベースURL：** `https://{domain}/api`
- **文字コード：** UTF-8
- **日時形式：** ISO 8601（例：`2026-04-20T10:00:00+09:00`）

---

## 2. 認証・認可

| エンドポイント種別 | 認証方法 |
|-----------------|---------|
| 一般ユーザー向け（GET） | 認証不要（匿名アクセス可）。ログイン時はClerkのセッションCookieを自動送信 |
| 一般ユーザー向け（POST/DELETE） | Clerkセッション必須。`auth()`でサーバー側検証 |
| 管理者向け（`/admin/`） | Clerkセッション必須 ＋ `admin`ロール必須 |

```typescript
// サーバー側での認証チェック例
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  // ...
}

// 管理者チェック例
const { sessionClaims } = await auth()
if (sessionClaims?.role !== 'admin') {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## 3. 共通レスポンス形式

**成功時：**
```json
{
  "data": { ... },      // または配列
  "total": 100,         // 一覧取得時のみ
  "page": 1,
  "limit": 20
}
```

**エラー時：**
```json
{
  "error": "エラーメッセージ",
  "code": "ERROR_CODE"
}
```

**主なHTTPステータスコード：**

| コード | 意味 |
|--------|------|
| 200 | 成功（GET・PUT） |
| 201 | 作成成功（POST） |
| 204 | 削除成功（DELETE） |
| 400 | バリデーションエラー |
| 401 | 未認証 |
| 403 | 権限なし |
| 404 | リソースが見つからない |
| 422 | 処理できないエンティティ（スクレイピング失敗等） |
| 500 | サーバーエラー |

---

## 4. エンドポイント一覧

### 4.1 コンテンツ系

#### GET /api/contents — コンテンツ一覧取得

**説明：** 公開済みコンテンツの一覧を取得する。認証不要。

**クエリパラメータ：**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| genre | string | - | ジャンルスラグ（例：`camp`）。未指定は全ジャンル |
| q | string | - | キーワード検索（タイトル・説明・場所名） |
| prefecture | string | - | 都道府県で絞り込み（例：`青森県`） |
| page | number | - | ページ番号（デフォルト：1） |
| limit | number | - | 1ページあたり件数（デフォルト：20、最大：50） |

**リクエスト例：**
```
GET /api/contents?genre=camp&prefecture=青森県&page=1&limit=20
```

**レスポンス 200：**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "奥入瀬渓流キャンプ場",
      "description": "青森の大自然に囲まれた静かなキャンプ場。渓流沿いのサイトが魅力。",
      "image_url": "https://xxxx.supabase.co/storage/v1/object/public/images/camp001.jpg",
      "external_url": "https://note.com/example/n/xxxxxxxx",
      "source_type": "note",
      "genre": {
        "id": "uuid",
        "name": "キャンプ",
        "slug": "camp"
      },
      "location_name": "奥入瀬渓流",
      "prefecture": "青森県",
      "bookmark_count": 42,
      "is_bookmarked": false
    }
  ],
  "total": 85,
  "page": 1,
  "limit": 20
}
```

---

#### GET /api/contents/:id — コンテンツ詳細取得

**説明：** 特定コンテンツの詳細を取得する。認証不要。view_countをインクリメントする。

**リクエスト例：**
```
GET /api/contents/550e8400-e29b-41d4-a716-446655440000
```

**レスポンス 200：**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "奥入瀬渓流キャンプ場",
    "description": "青森の大自然に囲まれた静かなキャンプ場。渓流沿いのサイトが魅力。",
    "image_url": "https://...",
    "external_url": "https://note.com/...",
    "source_type": "note",
    "genre": { "id": "uuid", "name": "キャンプ", "slug": "camp" },
    "location_name": "奥入瀬渓流",
    "prefecture": "青森県",
    "bookmark_count": 42,
    "view_count": 150,
    "is_bookmarked": false,
    "created_at": "2026-04-01T10:00:00+09:00"
  }
}
```

**レスポンス 404：**
```json
{ "error": "コンテンツが見つかりません" }
```

---

### 4.2 ブックマーク系

#### GET /api/bookmarks — ブックマーク一覧取得

**説明：** ログインユーザーのブックマーク一覧を取得する。**認証必須。**

**クエリパラメータ：**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| category | string | - | カテゴリで絞り込み（例：`行きたい場所`） |
| page | number | - | ページ番号（デフォルト：1） |
| limit | number | - | 件数（デフォルト：20） |

**レスポンス 200：**
```json
{
  "data": [
    {
      "id": "bookmark-uuid",
      "category": "行きたい場所",
      "created_at": "2026-04-10T09:00:00+09:00",
      "content": {
        "id": "content-uuid",
        "title": "奥入瀬渓流キャンプ場",
        "image_url": "https://...",
        "genre": { "name": "キャンプ" },
        "location_name": "奥入瀬渓流",
        "prefecture": "青森県"
      }
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 20
}
```

---

#### POST /api/bookmarks — ブックマーク保存

**説明：** コンテンツをコレクションに保存する。**認証必須。**

**リクエストボディ：**
```json
{
  "content_id": "550e8400-e29b-41d4-a716-446655440000",
  "category": "行きたい場所"
}
```

**バリデーション：**
- `content_id`：必須、UUID形式
- `category`：必須、文字列（最大20文字）

**レスポンス 201：**
```json
{
  "data": {
    "id": "bookmark-uuid",
    "content_id": "content-uuid",
    "category": "行きたい場所",
    "created_at": "2026-04-20T10:00:00+09:00"
  }
}
```

**レスポンス 409（既に保存済みの場合）：**
```json
{ "error": "既にコレクションに保存されています", "code": "ALREADY_BOOKMARKED" }
```

---

#### DELETE /api/bookmarks/:id — ブックマーク削除

**説明：** ブックマークを削除する（「気になる」解除）。**認証必須。本人のみ。**

**リクエスト例：**
```
DELETE /api/bookmarks/bookmark-uuid
```

**レスポンス 204：** No Content

**レスポンス 404：**
```json
{ "error": "ブックマークが見つかりません" }
```

---

### 4.3 ジャンル設定系

#### GET /api/genres — ジャンル一覧取得

**説明：** 全ジャンルの一覧を取得する。認証不要。

**レスポンス 200：**
```json
{
  "data": [
    { "id": "uuid", "name": "キャンプ", "slug": "camp", "sort_order": 1 },
    { "id": "uuid", "name": "温泉", "slug": "onsen", "sort_order": 2 }
  ]
}
```

---

#### POST /api/user/genre-preferences — ジャンル設定保存

**説明：** ユーザーの選択ジャンルを保存する。**認証必須。**

**リクエストボディ：**
```json
{
  "genre_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**レスポンス 200：**
```json
{ "message": "ジャンル設定を保存しました" }
```

---

### 4.4 管理者系（`/admin/` - adminロール必須）

#### GET /api/admin/contents — 管理者用コンテンツ一覧

**説明：** 全ステータスのコンテンツ一覧を取得する。

**クエリパラメータ：**

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| status | string | `draft`/`published`/`unpublished` で絞り込み |
| genre | string | ジャンルスラグで絞り込み |
| page | number | ページ番号 |

**レスポンス 200：** コンテンツ一覧（status・view_count・bookmark_countを含む）

---

#### POST /api/admin/contents — コンテンツ登録

**説明：** 新規コンテンツを登録する。

**リクエストボディ：**
```json
{
  "title": "奥入瀬渓流キャンプ場",
  "description": "青森の大自然に囲まれた...",
  "image_url": "https://...",
  "external_url": "https://note.com/...",
  "source_type": "note",
  "genre_id": "uuid",
  "location_name": "奥入瀬渓流",
  "prefecture": "青森県",
  "status": "draft"
}
```

**バリデーション：**
- `title`：必須、最大100文字
- `image_url`：必須、URL形式
- `external_url`：必須、URL形式
- `source_type`：必須、`note|x|youtube|instagram|blog|other`のいずれか
- `genre_id`：必須、UUID形式
- `status`：必須、`draft|published|unpublished`のいずれか

**レスポンス 201：** 作成したコンテンツ

---

#### PUT /api/admin/contents/:id — コンテンツ更新

**説明：** コンテンツを更新する。リクエストボディはPOSTと同形式（部分更新可）。

**レスポンス 200：** 更新後のコンテンツ

---

#### DELETE /api/admin/contents/:id — コンテンツ削除

**レスポンス 204：** No Content

---

#### POST /api/admin/scrape-ogp — OGPスクレイピング

**説明：** URLからOGP情報を取得する。コンテンツ登録フォームの入力補助。

**リクエストボディ：**
```json
{
  "url": "https://note.com/example/n/xxxxxxxx"
}
```

**処理内容：**
1. URLにHTTPリクエスト（node-fetch）
2. HTMLをパース（cheerio）
3. `<meta property="og:*">` タグから情報を抽出
4. source_typeをURLのドメインから自動判定

**レスポンス 200：**
```json
{
  "data": {
    "title": "奥入瀬渓流キャンプ場レポート",
    "description": "先週末に行ってきました。渓流沿いのサイトが最高で...",
    "image_url": "https://note.com/ogp_image.jpg",
    "source_type": "note"
  }
}
```

**レスポンス 422（OGP取得失敗）：**
```json
{
  "error": "OGP情報を取得できませんでした。手動で入力してください。",
  "code": "OGP_FETCH_FAILED"
}
```

---

#### GET /api/admin/analytics — 分析データ取得

**説明：** コンテンツの集計データを取得する。

**レスポンス 200：**
```json
{
  "data": {
    "total_contents": 100,
    "total_bookmarks": 450,
    "by_genre": [
      { "genre": "キャンプ", "content_count": 30, "bookmark_count": 180 },
      { "genre": "温泉", "content_count": 25, "bookmark_count": 120 }
    ],
    "top_contents": [
      { "id": "uuid", "title": "奥入瀬渓流...", "bookmark_count": 42, "view_count": 150 }
    ]
  }
}
```

---

## 5. Server Actions 一覧

Next.js App RouterではAPIルートに加え、Server Actionsでもデータ操作を行う。

| アクション | ファイル | 説明 |
|-----------|----------|------|
| `toggleBookmark` | `actions/bookmark.ts` | 気になる保存・解除（楽観的UI更新と連携） |
| `saveGenrePreferences` | `actions/user.ts` | ジャンル設定の保存 |
| `createContent` | `actions/content.ts` | コンテンツ登録（管理者） |
| `updateContent` | `actions/content.ts` | コンテンツ更新（管理者） |
| `deleteContent` | `actions/content.ts` | コンテンツ削除（管理者） |
| `scrapeOGP` | `actions/scrape.ts` | OGPスクレイピング（管理者） |
| `incrementViewCount` | `actions/content.ts` | 閲覧数インクリメント |
