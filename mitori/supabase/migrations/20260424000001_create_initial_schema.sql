-- ============================================================
-- Migration: 初期スキーマ作成
-- Purpose: MITORI の基本テーブル構造を作成
-- Tables: users, genres, contents, bookmarks, user_genre_preferences
-- ============================================================

-- ── 1. users テーブル ────────────────────────────────────────
create table public.users (
  id              uuid        primary key default gen_random_uuid(),
  clerk_user_id   text        not null unique,
  email           text        not null,
  created_at      timestamptz not null default now()
);
comment on table public.users is 'Clerk認証ユーザーと紐づくアプリユーザー情報';

alter table public.users enable row level security;

create policy "users_select_own" on public.users
  for select to authenticated
  using (clerk_user_id = auth.jwt() ->> 'sub');

create policy "users_insert_own" on public.users
  for insert to authenticated
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create index idx_users_clerk_user_id on public.users(clerk_user_id);

-- ── 2. genres テーブル ───────────────────────────────────────
create table public.genres (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);
comment on table public.genres is '趣味ジャンルのマスターデータ';

-- genres はRLS不要（全員閲覧可）
-- 初期データ
insert into public.genres (name, slug, sort_order) values
  ('キャンプ',    'camp',    1),
  ('温泉',        'onsen',   2),
  ('サウナ',      'sauna',   3),
  ('バイク',      'bike',    4),
  ('釣り',        'fishing', 5),
  ('古着',        'vintage', 6),
  ('ウイスキー',  'whiskey', 7),
  ('国内旅行',    'travel',  8);

-- ── 3. contents テーブル ─────────────────────────────────────
create table public.contents (
  id              uuid        primary key default gen_random_uuid(),
  title           text        not null,
  description     text,
  image_url       text        not null,
  external_url    text        not null,
  source_type     text        not null check (source_type in ('note','x','youtube','instagram','blog','other')),
  genre_id        uuid        not null references public.genres(id) on delete restrict,
  location_name   text,
  prefecture      text,
  status          text        not null default 'draft' check (status in ('draft','published','unpublished')),
  bookmark_count  int         not null default 0,
  view_count      int         not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.contents is '管理者がキュレーションするコンテンツ';

alter table public.contents enable row level security;

-- 全ユーザー（匿名含む）が公開コンテンツを参照可能
create policy "contents_select_published" on public.contents
  for select
  using (status = 'published');

-- 管理者（JWT role = admin）のみ全件操作可能
create policy "contents_admin_all" on public.contents
  for all to authenticated
  using ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

create index idx_contents_genre_id  on public.contents(genre_id);
create index idx_contents_status    on public.contents(status);
create index idx_contents_prefecture on public.contents(prefecture);

-- updated_at 自動更新トリガー
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger contents_updated_at
  before update on public.contents
  for each row execute function public.update_updated_at();

-- ── 4. bookmarks テーブル ────────────────────────────────────
create table public.bookmarks (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  content_id  uuid        not null references public.contents(id) on delete cascade,
  category    text        not null default '未分類',
  created_at  timestamptz not null default now(),
  unique (user_id, content_id)
);
comment on table public.bookmarks is 'ユーザーの気になる保存データ';

alter table public.bookmarks enable row level security;

create policy "bookmarks_select_own" on public.bookmarks
  for select to authenticated
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create policy "bookmarks_insert_own" on public.bookmarks
  for insert to authenticated
  with check (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create policy "bookmarks_delete_own" on public.bookmarks
  for delete to authenticated
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create index idx_bookmarks_user_id    on public.bookmarks(user_id);
create index idx_bookmarks_content_id on public.bookmarks(content_id);

-- bookmark_count 同期トリガー
create or replace function public.increment_bookmark_count()
returns trigger
language plpgsql
as $$
begin
  update public.contents set bookmark_count = bookmark_count + 1 where id = new.content_id;
  return new;
end;
$$;

create trigger bookmarks_after_insert
  after insert on public.bookmarks
  for each row execute function public.increment_bookmark_count();

create or replace function public.decrement_bookmark_count()
returns trigger
language plpgsql
as $$
begin
  update public.contents set bookmark_count = greatest(0, bookmark_count - 1) where id = old.content_id;
  return old;
end;
$$;

create trigger bookmarks_after_delete
  after delete on public.bookmarks
  for each row execute function public.decrement_bookmark_count();

-- ── 5. user_genre_preferences テーブル ───────────────────────
create table public.user_genre_preferences (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  genre_id    uuid        not null references public.genres(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, genre_id)
);
comment on table public.user_genre_preferences is 'ユーザーが選択した趣味ジャンル設定';

alter table public.user_genre_preferences enable row level security;

create policy "ugp_select_own" on public.user_genre_preferences
  for select to authenticated
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create policy "ugp_insert_own" on public.user_genre_preferences
  for insert to authenticated
  with check (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create policy "ugp_delete_own" on public.user_genre_preferences
  for delete to authenticated
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create index idx_ugp_user_id  on public.user_genre_preferences(user_id);
create index idx_ugp_genre_id on public.user_genre_preferences(genre_id);
