# API仕様書 - タスク管理アプリ

## 1. 設計原則
- バックエンド未実装のため、フロントエンドではモックデータを使用
- 将来的なAPI連携を想定したデータ構造を定義

## 2. データ型

### Task
```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO8601
}
```

## 3. 想定エンドポイント（将来用）

| メソッド | パス | 説明 |
|----------|------|------|
| GET | /api/tasks | タスク一覧取得 |
| POST | /api/tasks | タスク作成 |
| PATCH | /api/tasks/:id | タスク更新（完了フラグ等） |
| DELETE | /api/tasks/:id | タスク削除 |

## 4. モックデータ
フロントエンド実装時は `lib/mock-data.ts` でモックデータを定義し、ローカルstateで管理する。
