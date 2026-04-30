import { Suspense } from "react"
import Link from "next/link"
import { SlidersHorizontal } from "lucide-react"
import FeedGrid from "@/components/feed/FeedGrid"
import FilterButton from "@/components/feed/FilterButton"
import { mockFacilities } from "@/lib/mock-data"
import { sortPrefectures } from "@/lib/utils"

type SearchPageProps = {
  searchParams: Promise<{
    pref?: string | string[]
    q?: string
  }>
}

const allPrefectures = sortPrefectures([
  ...new Set(mockFacilities.map((f) => f.prefecture).filter(Boolean)),
] as string[])

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { pref, q } = await searchParams

  const prefs = Array.isArray(pref) ? pref : pref ? [pref] : []
  const keyword = q ?? ""
  const hasFilter = prefs.length > 0 || keyword

  const results = hasFilter
    ? mockFacilities.filter((f) => {
        const matchesPrefs =
          prefs.length === 0 || (f.prefecture != null && prefs.includes(f.prefecture))
        const matchesKeyword =
          !keyword ||
          f.title.includes(keyword) ||
          f.description.includes(keyword) ||
          (f.location_name?.includes(keyword) ?? false) ||
          (f.prefecture?.includes(keyword) ?? false) ||
          f.operator.includes(keyword)
        return matchesPrefs && matchesKeyword
      })
    : []

  return (
    <div className="px-4 pt-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-[#1A2538]">検索</h1>
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
              className="px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{ background: "rgba(26,75,122,0.1)", color: "#1A4B7A", borderColor: "rgba(26,75,122,0.3)" }}
            >
              {p}
            </span>
          ))}
          {keyword && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{ background: "rgba(26,75,122,0.1)", color: "#1A4B7A", borderColor: "rgba(26,75,122,0.3)" }}
            >
              「{keyword}」
            </span>
          )}
          <Link
            href="/search"
            className="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
            style={{ background: "#F0F5F9", color: "#8AA0B4", borderColor: "#D1DCE8" }}
          >
            クリア
          </Link>
        </div>
      )}

      {/* 結果 */}
      {hasFilter ? (
        <>
          <p className="text-sm text-[#4A6070] mb-3">{results.length}件が見つかりました</p>
          <FeedGrid facilities={results} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[#8AA0B4]">
          <SlidersHorizontal size={40} strokeWidth={1} className="mb-4 text-[#B0C4D4]" />
          <p className="text-base font-medium text-[#4A6070]">条件を設定して検索</p>
          <p className="text-sm mt-1 mb-6">都道府県や施設名で絞り込めます</p>
          <Suspense fallback={null}>
            <FilterButton prefectures={allPrefectures} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
