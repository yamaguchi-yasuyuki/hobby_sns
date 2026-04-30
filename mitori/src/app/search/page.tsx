import { Suspense } from "react"
import Link from "next/link"
import { SlidersHorizontal } from "lucide-react"
import FeedGrid from "@/components/feed/FeedGrid"
import FilterButton from "@/components/feed/FilterButton"
import { mockContents } from "@/lib/mock-data"

type SearchPageProps = {
  searchParams: Promise<{
    pref?: string | string[]
    q?: string
  }>
}

const allPrefectures = [
  ...new Set(mockContents.map((c) => c.prefecture).filter(Boolean)),
].sort() as string[]

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { pref, q } = await searchParams

  const prefs = Array.isArray(pref) ? pref : pref ? [pref] : []
  const keyword = q ?? ""
  const hasFilter = prefs.length > 0 || keyword

  const results = hasFilter
    ? mockContents.filter((c) => {
        const matchesPrefs =
          prefs.length === 0 || (c.prefecture != null && prefs.includes(c.prefecture))
        const matchesKeyword =
          !keyword ||
          c.title.includes(keyword) ||
          c.description.includes(keyword) ||
          (c.location_name?.includes(keyword) ?? false) ||
          (c.prefecture?.includes(keyword) ?? false)
        return matchesPrefs && matchesKeyword
      })
    : []

  return (
    <div className="px-4 pt-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-[#2C2C2C]">検索</h1>
        <Suspense fallback={null}>
          <FilterButton prefectures={allPrefectures} />
        </Suspense>
      </div>

      {/* アクティブフィルタータグ */}
      {hasFilter && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {prefs.map((p) => (
            <span
              key={p}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#8B6F47]/15 text-[#8B6F47] border border-[#8B6F47]/30"
            >
              {p}
            </span>
          ))}
          {keyword && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#8B6F47]/15 text-[#8B6F47] border border-[#8B6F47]/30">
              「{keyword}」
            </span>
          )}
          <Link
            href="/search"
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F7F5F2] text-[#A0A0A0] border border-[#E2DED8] hover:text-[#6B6B6B] transition-colors"
          >
            クリア
          </Link>
        </div>
      )}

      {/* 結果 */}
      {hasFilter ? (
        <>
          <p className="text-sm text-[#6B6B6B] mb-3">{results.length}件が見つかりました</p>
          <FeedGrid contents={results} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[#A0A0A0]">
          <SlidersHorizontal size={40} strokeWidth={1} className="mb-4 text-[#C8C4BE]" />
          <p className="text-base font-medium text-[#6B6B6B]">条件を設定して検索</p>
          <p className="text-sm mt-1 mb-6">都道府県やキーワードで絞り込めます</p>
          <Suspense fallback={null}>
            <FilterButton prefectures={allPrefectures} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
