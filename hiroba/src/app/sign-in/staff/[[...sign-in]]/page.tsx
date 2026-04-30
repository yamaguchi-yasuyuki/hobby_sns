import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { HirobaRoleSignIn } from "@/components/auth/hiroba-role-sign-in"
import { RoleSignInWrongAccount } from "@/components/auth/role-sign-in-wrong-account"
import {
  accountKindFromClerkUser,
  isMunicipalityStaffKind,
} from "@/lib/hiroba/account-kind"
import { HIROBA_AUTH_ROUTES } from "@/lib/hiroba/auth-routes"

export default async function StaffSignInPage() {
  const r = HIROBA_AUTH_ROUTES.staff
  const { userId } = await auth()
  if (userId) {
    const user = await currentUser()
    const kind = accountKindFromClerkUser(user)
    if (isMunicipalityStaffKind(kind)) {
      redirect(r.afterAuth)
    }
    return (
      <RoleSignInWrongAccount
        title="施設情報 登録者ログイン"
        explanation="いまログインしているアカウントには登録者権限（Clerk の hirobaAccountKind: municipality_staff）がありません。一度ログアウトしてから、組織から案内された専用アカウントでサインインしてください。"
        afterSignOutRedirectUrl={r.signInPath}
      />
    )
  }

  return (
    <HirobaRoleSignIn
      signUpPath={r.signUpPath}
      afterAuthUrl={r.afterAuth}
      title="施設情報 登録者ログイン"
      description="自治体・情報登録担当者向けです。組織から案内された専用アカウントでサインインしてください。"
      backLabel="一般の方はトップへ"
    />
  )
}
