import Link from "next/link"
import { List, Plus, FileText } from "lucide-react"
import { mockFacilities } from "@/lib/mock-data"

export default function MunicipalityDashboardPage() {
  const published = mockFacilities.filter((f) => f.status === "published").length
  const draft = mockFacilities.filter((f) => f.status === "draft").length

  return (
    <div>
      <h1 className="text-xl font-extrabold text-[#1E3A2F] mb-6">ダッシュボード</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div
          className="rounded-2xl p-5"
          style={{ background: "#FFFFFF", border: "2px solid #C8DDD0" }}
        >
          <p className="text-[11px] font-bold text-[#88A898] uppercase tracking-wider mb-1">登録件数（デモ）</p>
          <p className="text-2xl font-extrabold text-[#1E7A4A]">{mockFacilities.length}</p>
          <p className="text-[12px] text-[#4A7060] mt-1">モックデータ全件</p>
        </div>
        <div
          className="rounded-2xl p-5"
          style={{ background: "#FFFFFF", border: "2px solid #C8DDD0" }}
        >
          <p className="text-[11px] font-bold text-[#88A898] uppercase tracking-wider mb-1">公開</p>
          <p className="text-2xl font-extrabold text-[#1E3A2F]">{published}</p>
        </div>
        <div
          className="rounded-2xl p-5"
          style={{ background: "#FFFFFF", border: "2px solid #C8DDD0" }}
        >
          <p className="text-[11px] font-bold text-[#88A898] uppercase tracking-wider mb-1">下書き</p>
          <p className="text-2xl font-extrabold text-[#1E3A2F]">{draft}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link
          href="/admin/municipality/facilities"
          className="flex items-center gap-3 rounded-2xl p-5 transition-shadow hover:shadow-md"
          style={{ background: "#E8F5ED", border: "2px solid #C8DDD0" }}
        >
          <List size={22} className="text-[#1E7A4A] shrink-0" />
          <div>
            <p className="text-[14px] font-extrabold text-[#1E3A2F]">施設一覧</p>
            <p className="text-[12px] text-[#4A7060]">編集・削除</p>
          </div>
        </Link>
        <Link
          href="/admin/municipality/facilities/new"
          className="flex items-center gap-3 rounded-2xl p-5 transition-shadow hover:shadow-md"
          style={{ background: "#FEF0E7", border: "2px solid #F5C89A" }}
        >
          <Plus size={22} className="text-[#D46A10] shrink-0" />
          <div>
            <p className="text-[14px] font-extrabold text-[#1E3A2F]">新規登録</p>
            <p className="text-[12px] text-[#4A7060]">写真・テキスト・リンク</p>
          </div>
        </Link>
        <div
          className="flex items-center gap-3 rounded-2xl p-5"
          style={{ background: "#FFFFFF", border: "2px dashed #C8DDD0" }}
        >
          <FileText size={22} className="text-[#88A898] shrink-0" />
          <div>
            <p className="text-[14px] font-extrabold text-[#1E3A2F]">画面設計書</p>
            <p className="text-[12px] text-[#88A898]">リポジトリ: docs/MUNICIPALITY_ADMIN_UI.md</p>
          </div>
        </div>
      </div>
    </div>
  )
}
