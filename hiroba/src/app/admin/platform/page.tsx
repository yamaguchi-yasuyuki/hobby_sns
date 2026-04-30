import Link from "next/link"
import { Settings, Shield } from "lucide-react"
import { requirePlatformOperator } from "@/lib/auth/platform-operator"

export default async function PlatformAdminPage() {
  await requirePlatformOperator()

  return (
    <div className="admin-root-wide max-w-6xl mx-auto px-4 py-8 md:py-10 w-full min-h-[50vh]">
      <div className="flex items-center gap-3 mb-6">
        <Shield size={28} className="text-[#1E7A4A]" />
        <div>
          <h1 className="text-xl font-extrabold text-[#1E3A2F]">運営者コンソール</h1>
          <p className="text-[13px] text-[#4A7060]">広場のマスターアドミン向けエリアです。</p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "#FFFFFF", border: "2px solid #C8DDD0" }}
      >
        <p className="text-[14px] text-[#4A7060] leading-relaxed mb-4">
          施設マスタの横断管理・全社設定・監査ログなどの UI は、要件に合わせてここに追加できます。現時点ではプレースホルダーです。
        </p>
        <ul className="text-[13px] text-[#88A898] space-y-2 list-disc pl-5">
          <li>Clerk の <code className="text-[#1E3A2F]">platform_operator</code> メタデータで入域しています</li>
          <li>自治体向け管理は <Link href="/admin/municipality" className="text-[#1E7A4A] font-bold hover:underline">/admin/municipality</Link> です</li>
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5 flex items-start gap-3 opacity-80"
          style={{ background: "#F5F9F5", border: "2px dashed #C8DDD0" }}
        >
          <Settings size={22} className="text-[#88A898] shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-extrabold text-[#1E3A2F]">全体設定（予定）</p>
            <p className="text-[12px] text-[#88A898] mt-1">機能フラグ・メンテナンス表示など</p>
          </div>
        </div>
        <Link
          href="/"
          className="rounded-2xl p-5 flex items-center gap-3 transition-shadow hover:shadow-md border-2 border-[#C8DDD0] bg-white"
        >
          <span className="text-[14px] font-extrabold text-[#1E7A4A]">一般サイトを確認 →</span>
        </Link>
      </div>
    </div>
  )
}
