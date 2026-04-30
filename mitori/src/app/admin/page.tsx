import Link from "next/link"
import { FileText, Bookmark, Eye, Plus } from "lucide-react"
import { mockContents } from "@/lib/mock-data"

export default function AdminDashboardPage() {
  const totalContents = mockContents.length
  const totalBookmarks = mockContents.reduce((sum, c) => sum + c.bookmark_count, 0)
  const totalViews = mockContents.reduce((sum, c) => sum + c.view_count, 0)
  const topContents = [...mockContents]
    .sort((a, b) => b.bookmark_count - a.bookmark_count)
    .slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#2C2C2C]">管理ダッシュボード</h1>
        <Link
          href="/admin/contents/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2D4A3E] text-white text-sm font-medium hover:bg-[#243d33] transition-colors"
        >
          <Plus size={16} />
          新規登録
        </Link>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "コンテンツ数", value: totalContents, icon: FileText, color: "text-[#2D4A3E]" },
          { label: "総保存数", value: totalBookmarks.toLocaleString(), icon: Bookmark, color: "text-[#8B6F47]" },
          { label: "総閲覧数", value: totalViews.toLocaleString(), icon: Eye, color: "text-[#6B6B6B]" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-[#E2DED8]">
            <div className={`mb-2 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-[#2C2C2C]">{value}</p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* 人気コンテンツ */}
      <div className="bg-white rounded-xl border border-[#E2DED8] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2DED8]">
          <h2 className="text-sm font-semibold text-[#2C2C2C]">人気コンテンツ TOP5</h2>
        </div>
        <div className="divide-y divide-[#E2DED8]">
          {topContents.map((content, i) => (
            <div key={content.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-bold text-[#A0A0A0] w-5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#2C2C2C] truncate">{content.title}</p>
                <p className="text-xs text-[#A0A0A0]">{content.genre.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[#8B6F47]">
                  {content.bookmark_count}
                </p>
                <p className="text-xs text-[#A0A0A0]">保存</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
