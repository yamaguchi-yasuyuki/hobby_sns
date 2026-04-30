-- ============================================================
-- Migration: アカウント種別（一般 / 自治体職員 / 運営者）
-- Purpose: 運営者（マスターアドミン）を複数人まで拡張可能にする
-- ============================================================

alter table public.users
  add column if not exists account_kind text not null default 'general';

alter table public.users
  drop constraint if exists users_account_kind_check;

alter table public.users
  add constraint users_account_kind_check
  check (account_kind in ('general', 'municipality_staff', 'platform_operator'));

comment on column public.users.account_kind is
  'general: 一般（パパ・ママ等） / municipality_staff: 自治体職員（施設情報の登録側・将来） / platform_operator: 広場の運営者（マスターアドミン・複数可）';

create index if not exists idx_users_platform_operators
  on public.users(account_kind)
  where account_kind = 'platform_operator';
