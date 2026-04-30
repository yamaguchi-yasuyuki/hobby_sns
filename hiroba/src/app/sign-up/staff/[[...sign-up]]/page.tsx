import { HirobaRoleSignUp } from "@/components/auth/hiroba-role-sign-up"
import { HIROBA_AUTH_ROUTES } from "@/lib/hiroba/auth-routes"

export default function StaffSignUpPage() {
  const r = HIROBA_AUTH_ROUTES.staff
  return (
    <HirobaRoleSignUp
      signInPath={r.signInPath}
      afterAuthUrl={r.afterAuth}
      title="施設情報 登録者アカウント登録"
      description="初回のみ表示されます。登録後は登録者向けコンソールへ移動します。"
      backLabel="一般の方はトップへ"
    />
  )
}
