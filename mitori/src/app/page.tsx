import { Suspense } from "react"
import GenreFilterBar from "@/components/feed/GenreFilterBar"
import FeedGrid from "@/components/feed/FeedGrid"
import { mockGenres, mockContents } from "@/lib/mock-data"

type HomePageProps = {
  searchParams: Promise<{
    genre?: string
    pref?: string | string[]
    q?: string
  }>
}

// モックデータから全都道府県を抽出（ソート済み）
const allPrefectures = [
  ...new Set(mockContents.map((c) => c.prefecture).filter(Boolean)),
].sort() as string[]

export default async function HomePage({ searchParams }: HomePageProps) {
  const { genre, pref, q } = await searchParams

  // pref は string | string[] になる可能性があるので正規化
  const prefs = Array.isArray(pref) ? pref : pref ? [pref] : []
  const keyword = q ?? ""

  const filtered = mockContents.filter((c) => {
    const matchesGenre = !genre || c.genre.slug === genre
    const matchesPrefs =
      prefs.length === 0 || (c.prefecture != null && prefs.includes(c.prefecture))
    const matchesKeyword =
      !keyword ||
      c.title.includes(keyword) ||
      c.description.includes(keyword) ||
      (c.location_name?.includes(keyword) ?? false) ||
      (c.prefecture?.includes(keyword) ?? false)

    return matchesGenre && matchesPrefs && matchesKeyword
  })

  return (
    <>
      <Suspense fallback={<div className="h-12 bg-[#F7F5F2]" />}>
        <GenreFilterBar genres={mockGenres} prefectures={allPrefectures} />
      </Suspense>

      <div className="px-5 pt-6">
        {filtered.length === 0 && (prefs.length > 0 || keyword) ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#A09890]">
            <p className="text-[14px] tracking-[0.05em]">条件に合うコンテンツが見つかりません</p>
            <p className="text-[12px] mt-2 text-[#C4BDB5] tracking-[0.05em]">絞り込み条件を変えてみてください</p>
          </div>
        ) : (
          <FeedGrid contents={filtered} />
        )}
      </div>
    </>
  )
}
