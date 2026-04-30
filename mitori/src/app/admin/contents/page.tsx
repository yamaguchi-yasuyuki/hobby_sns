import Link from "next/link"
import { Plus, Pencil, Eye, Bookmark } from "lucide-react"
import { mockContents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const statusLabels = {
  published: { label: "公開", className: "bg-green-100 text-green-700" },
  draft: { label: "下書き", className: "bg-yellow-100 text-yellow-700" },
  unpublished: { label: "非公開", className: "bg-gray-100 text-gray-600" },
}

export default function AdminContentsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#2C2C2C]">コンテンツ管理</h1>
        <Link
          href="/admin/contents/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2D4A3E] text-white text-sm font-medium hover:bg-[#243d33] transition-colors"
        >
          <Plus size={16} />
          新規登録
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E2DED8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F5F2] border-b border-[#E2DED8]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[#6B6B6B]">タイトル</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6B6B6B] hidden sm:table-cell">ジャンル</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6B6B6B] hidden md:table-cell">場所</th>
                <th className="text-center px-4 py-3 font-semibold text-[#6B6B6B]">ステータス</th>
                <th className="text-right px-4 py-3 font-semibold text-[#6B6B6B]">保存/閲覧</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DED8]">
              {mockContents.map((content) => {
                const status = statusLabels[content.status]
                return (
                  <tr key={content.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#2C2C2C] line-clamp-1 max-w-[200px]">
                        {content.title}
                      </p>
                      <p className="text-xs text-[#A0A0A0] mt-0.5">{content.source_type}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[#6B6B6B]">{content.genre.name}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[#6B6B6B] text-xs">
                        {content.prefecture ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3 text-xs text-[#6B6B6B]">
                        <span className="flex items-center gap-1">
                          <Bookmark size={12} />
                          {content.bookmark_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {content.view_count}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/contents/${content.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-[#E2DED8] transition-colors text-[#6B6B6B] hover:text-[#2D4A3E] inline-block"
                        aria-label="編集"
                      >
                        <Pencil size={14} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
