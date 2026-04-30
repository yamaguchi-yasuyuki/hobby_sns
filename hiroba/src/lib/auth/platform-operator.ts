/**
 * 運営者判定（Clerk publicMetadata `hirobaAccountKind`）。
 * 誰が運営者かはメールではなくメタデータで決める。運用上は専用アカウント推奨 — docs/ROLES_AND_OPERATORS.md
 */
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  accountKindFromClerkUser,
  isPlatformOperatorKind,
  type HirobaAccountKind,
} from "@/lib/hiroba/account-kind"
import { HIROBA_AUTH_ROUTES } from "@/lib/hiroba/auth-routes"
import { getSupabaseUserByClerkId } from "@/lib/supabase/auth-helpers"

/** Clerk メタデータを優先（ログイン直後でも判定可能）。必要なら DB と整合チェックを追加可能 */
export async function getSessionAccountKind() {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  return accountKindFromClerkUser(user)
}

/** DB に同期済みの users 行から取得（バッチ・監査向け） */
export async function getStoredAccountKind(): Promise<HirobaAccountKind | null> {
  const row = await getSupabaseUserByClerkId()
  if (!row || typeof row !== "object" || !("account_kind" in row)) return null
  const raw = (row as { account_kind: unknown }).account_kind
  if (raw === "general" || raw === "municipality_staff" || raw === "platform_operator") {
    return raw
  }
  return null
}

export async function isPlatformOperator(): Promise<boolean> {
  const kind = await getSessionAccountKind()
  return kind != null && isPlatformOperatorKind(kind)
}

/** 運営者専用ルート用。未ログイン・権限なしは運営者専用サインインへ */
export async function requirePlatformOperator() {
  const { userId } = await auth()
  if (!userId) redirect(HIROBA_AUTH_ROUTES.operator.signInPath)
  const ok = await isPlatformOperator()
  if (!ok) redirect(HIROBA_AUTH_ROUTES.operator.signInPath)
}
