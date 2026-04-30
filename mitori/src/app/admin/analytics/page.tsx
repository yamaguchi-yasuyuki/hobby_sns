import { BarChart2, TrendingUp, Bookmark } from "lucide-react"
import { mockContents, mockGenres } from "@/lib/mock-data"

export default function AdminAnalyticsPage() {
  const genreStats = mockGenres.map((genre) => {
    const genreContents = mockContents.filter((c) => c.genre.id === genre.id)
    return {
      genre,
      contentCount: genreContents.length,
      totalBookmarks: genreContents.reduce((sum, c) => sum + c.bookmark_count, 0),
      totalViews: genreContents.reduce((sum, c) => sum + c.view_count, 0),
    }
  }).sort((a, b) => b.totalBookmarks - a.totalBookmarks)

  const maxBookmarks = Math.max(...genreStats.map((s) => s.totalBookmarks), 1)

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={20} className="text-[#2D4A3E]" />
        <h1 className="text-xl font-bold text-[#2C2C2C]">コンテンツ分析</h1>
      </div>

      {/* ジャンル別保存数 */}
      <div className="bg-white rounded-xl border border-[#E2DED8] p-5 mb-6">
        <h2 className="text-sm font-semibold text-[#2C2C2C] flex items-center gap-2 mb-4">
          <Bookmark size={15} className="text-[#8B6F47]" />
          ジャンル別 保存数ランキング
        </h2>
        <div className="space-y-3">
          {genreStats.map(({ genre, totalBookmarks, contentCount }) => (
            <div key={genre.id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-[#2C2C2C] font-medium">{genre.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#A0A0A0]">{contentCount}件</span>
                  <span className="text-[#8B6F47] font-semibold">
                    {totalBookmarks.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-[#EFEDE9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B6F47] rounded-full transition-all"
                  style={{ width: `${(totalBookmarks / maxBookmarks) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 人気コンテンツ詳細 */}
      <div className="bg-white rounded-xl border border-[#E2DED8] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2DED8] flex items-center gap-2">
          <TrendingUp size={15} className="text-[#2D4A3E]" />
          <h2 className="text-sm font-semibold text-[#2C2C2C]">コンテンツ別パフォーマンス</h2>
        </div>
        <div className="divide-y divide-[#E2DED8]">
          {[...mockContents]
            .sort((a, b) => b.bookmark_count - a.bookmark_count)
            .map((content, i) => (
              <div key={content.id} className="px-4 py-3 flex items-center gap-3">
                <span className="text-sm font-bold text-[#A0A0A0] w-5 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#2C2C2C] truncate">{content.title}</p>
                  <p className="text-xs text-[#A0A0A0]">{content.genre.name}</p>
                </div>
                <div className="flex gap-4 text-xs flex-shrink-0">
                  <div className="text-center">
                    <p className="font-semibold text-[#8B6F47]">{content.bookmark_count}</p>
                    <p className="text-[#A0A0A0]">保存</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-[#6B6B6B]">{content.view_count.toLocaleString()}</p>
                    <p className="text-[#A0A0A0]">閲覧</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
