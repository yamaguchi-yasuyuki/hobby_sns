import Link from "next/link"
import { Building2, TreePine } from "lucide-react"

/** `/admin` 直アクセス用。どちらのコンソールか選べるようにする */
export default function AdminIndexPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12 md:py-16">
      <h1 className="text-xl font-extrabold text-[#1E3A2F] mb-2">管理画面の入口</h1>
      <p className="text-[13px] text-[#4A7060] mb-8 leading-relaxed">
        権限に応じて次のいずれかを開いてください。
      </p>
      <ul className="space-y-4">
        <li>
          <Link
            href="/admin/municipality"
            className="flex items-center gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md border-2 border-[#C8DDD0] bg-white"
          >
            <Building2 size={28} className="text-[#1E7A4A] shrink-0" />
            <div>
              <p className="text-[15px] font-extrabold text-[#1E3A2F]">自治体・施設登録担当</p>
              <p className="text-[12px] text-[#88A898] mt-0.5">municipality_staff</p>
            </div>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/platform"
            className="flex items-center gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md border-2 border-[#C8DDD0] bg-white"
          >
            <TreePine size={28} className="text-[#1E7A4A] shrink-0" />
            <div>
              <p className="text-[15px] font-extrabold text-[#1E3A2F]">広場 運営者</p>
              <p className="text-[12px] text-[#88A898] mt-0.5">platform_operator</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  )
}
