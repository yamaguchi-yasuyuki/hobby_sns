import type { ReactNode } from "react"
import { Suspense } from "react"
import { requireMunicipalityStaff } from "@/lib/auth/municipality-staff"
import MunicipalitySubNav from "@/components/admin/municipality/MunicipalitySubNav"

export default async function MunicipalityAdminLayout({ children }: { children: ReactNode }) {
  await requireMunicipalityStaff()

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 w-full min-h-[50vh]">
      <p className="text-[13px] text-[#4A7060] mb-1 leading-relaxed">
        施設カードの一覧・編集・削除・新規登録。保存処理は DB 連携後に有効になります。
      </p>
      <Suspense
        fallback={
          <nav className="py-4 mb-6 text-[13px] text-[#88A898]" aria-busy="true">
            メニューを読み込み中…
          </nav>
        }
      >
        <MunicipalitySubNav />
      </Suspense>
      {children}
    </div>
  )
}
