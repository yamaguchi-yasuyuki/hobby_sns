-- ============================================================
-- Migration: 初期スキーマ作成
-- Purpose: HIROBA の基本テーブル構造を作成
-- Tables: users, bookmarks
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

-- ── 2. bookmarks テーブル ─────────────────────────────────────
-- facility_id は施設のモックID（text型）
create table public.bookmarks (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.users(id) on delete cascade,
  facility_id   text        not null,
  category      text        not null default '未分類',
  created_at    timestamptz not null default now(),
  unique (user_id, facility_id)
);
comment on table public.bookmarks is 'ユーザーのお気に入り施設保存データ';

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
create index idx_bookmarks_facility_id on public.bookmarks(facility_id);
