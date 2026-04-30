/**
 * 自治体職員（情報登録側）判定。Clerk publicMetadata `hirobaAccountKind: "municipality_staff"`。
 * 専用ログイン: /sign-in/staff — docs/ROLES_AND_OPERATORS.md
 */
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  accountKindFromClerkUser,
  isMunicipalityStaffKind,
} from "@/lib/hiroba/account-kind"
import { HIROBA_AUTH_ROUTES } from "@/lib/hiroba/auth-routes"

export async function isMunicipalityStaff(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false
  const user = await currentUser()
  const kind = accountKindFromClerkUser(user)
  return isMunicipalityStaffKind(kind)
}

/** 自治体向け管理エリア用。未ログイン・権限なしは専用サインインへ（説明・ログアウト導線を表示） */
export async function requireMunicipalityStaff() {
  const { userId } = await auth()
  if (!userId) redirect(HIROBA_AUTH_ROUTES.staff.signInPath)
  const ok = await isMunicipalityStaff()
  if (!ok) redirect(HIROBA_AUTH_ROUTES.staff.signInPath)
}
