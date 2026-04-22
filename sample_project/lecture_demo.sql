-- ============================================
-- 講義デモ用 SQL
-- Supabase SQL エディターで実行するサンプル
-- ============================================

-- 1. テーブル作成（既存の場合は削除してから作成）
drop table if exists public.demo_books;

create table public.demo_books (
  id bigint generated always as identity primary key,
  title text not null,
  author text not null,
  price integer not null default 0,
  created_at timestamptz default now() not null
);

comment on table public.demo_books is '講義デモ用：書籍サンプルテーブル';

-- 2. サンプルデータの投入
insert into public.demo_books (title, author, price) values
  ('PostgreSQL完全ガイド', '山田太郎', 3500),
  ('Supabase入門', '佐藤花子', 2800),
  ('SQL基礎から実践まで', '鈴木一郎', 4200),
  ('Webアプリ開発の教科書', '田中次郎', 3100),
  ('データベース設計パターン', '高橋美咲', 3900);

-- 3. データの確認（SELECT）
select * from public.demo_books order by id;

-- 4. オプション：条件付き検索の例（講義で説明用）
-- select * from public.demo_books where price >= 3000;
-- select title, author from public.demo_books where author like '%太郎%';
