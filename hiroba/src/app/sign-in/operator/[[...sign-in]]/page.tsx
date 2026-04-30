import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { HirobaRoleSignIn } from "@/components/auth/hiroba-role-sign-in"
import { RoleSignInWrongAccount } from "@/components/auth/role-sign-in-wrong-account"
import {
  accountKindFromClerkUser,
  isPlatformOperatorKind,
} from "@/lib/hiroba/account-kind"
import { HIROBA_AUTH_ROUTES } from "@/lib/hiroba/auth-routes"

export default async function OperatorSignInPage() {
  const r = HIROBA_AUTH_ROUTES.operator
  const { userId } = await auth()
  if (userId) {
    const user = await currentUser()
    const kind = accountKindFromClerkUser(user)
    if (isPlatformOperatorKind(kind)) {
      redirect(r.afterAuth)
    }
    return (
      <RoleSignInWrongAccount
        title="広場 運営者ログイン"
        explanation="いまログインしているアカウントには運営者権限（Clerk の hirobaAccountKind: platform_operator）がありません。一般ユーザーで入っている場合は、一度ログアウトしてから運営用アカウントでサインインしてください。"
        afterSignOutRedirectUrl={r.signInPath}
      />
    )
  }

  return (
    <HirobaRoleSignIn
      signUpPath={r.signUpPath}
      afterAuthUrl={r.afterAuth}
      title="広場 運営者ログイン"
      description="運営用の専用アカウントでサインインしてください。権限は Clerk のメタデータで付与されます。"
      backLabel="一般の方はトップへ"
    />
  )
}
