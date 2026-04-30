import { HirobaRoleSignUp } from "@/components/auth/hiroba-role-sign-up"
import { HIROBA_AUTH_ROUTES } from "@/lib/hiroba/auth-routes"

export default function OperatorSignUpPage() {
  const r = HIROBA_AUTH_ROUTES.operator
  return (
    <HirobaRoleSignUp
      signInPath={r.signInPath}
      afterAuthUrl={r.afterAuth}
      title="広場 運営者アカウント登録"
      description="初回のみ表示されます。登録後は運営者コンソールへ移動します。"
      backLabel="一般の方はトップへ"
    />
  )
}
