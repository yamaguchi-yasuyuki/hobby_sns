import { Suspense } from "react"
import Image from "next/image"
import { redirect } from "next/navigation"
import CategoryFilterBar from "@/components/feed/CategoryFilterBar"
import FeedGrid from "@/components/feed/FeedGrid"
import { mockCategories, mockFacilities } from "@/lib/mock-data"
import { sortPrefectures } from "@/lib/utils"

type HomePageProps = {
  searchParams: Promise<{
    cat?: string
    pref?: string | string[]
    q?: string
    saved?: string
  }>
}

const allPrefectures = sortPrefectures([
  ...new Set(mockFacilities.map((f) => f.prefecture).filter(Boolean)),
] as string[])

export default async function HomePage({ searchParams }: HomePageProps) {
  const { cat, pref, q, saved } = await searchParams
  if (saved === "1" || saved === "true") {
    redirect("/collection")
  }

  const prefs = Array.isArray(pref) ? pref : pref ? [pref] : []
  const keyword = q ?? ""
  const hasFilter = !!cat || prefs.length > 0 || !!keyword

  const filtered = mockFacilities.filter((f) => {
    const matchesCat     = !cat || f.category.slug === cat
    const matchesPrefs   =
      prefs.length === 0 || (f.prefecture != null && prefs.includes(f.prefecture))
    const matchesKeyword =
      !keyword ||
      f.title.includes(keyword) ||
      f.description.includes(keyword) ||
      (f.location_name?.includes(keyword) ?? false) ||
      (f.prefecture?.includes(keyword) ?? false) ||
      f.operator.includes(keyword)

    return matchesCat && matchesPrefs && matchesKeyword
  })

  return (
    <>
      <Suspense fallback={<div className="h-12 bg-[#F5F9F5]" />}>
        <CategoryFilterBar categories={mockCategories} prefectures={allPrefectures} />
      </Suspense>

      {/* ヒーローバナー（フィルター未選択時のみ表示） */}
      {!hasFilter && (
        <div className="mx-4 mt-5 mb-1 rounded-2xl overflow-hidden relative" style={{ height: "300px" }}>
          {/* 家族写真 */}
          <Image
            src="/images/family.png"
            alt="家族のおでかけ"
            fill
            className="object-cover"
            style={{ objectPosition: "center 50%" }}
            priority
            unoptimized
          />
          {/* グラデーションオーバーレイ */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(20,92,56,0.92) 0%, rgba(20,92,56,0.75) 45%, rgba(20,92,56,0.15) 75%, transparent 100%)",
            }}
          />
          {/* テキストコンテンツ */}
          <div className="relative z-10 px-6 h-full flex flex-col justify-center">
            <p className="text-white/80 text-[11px] font-bold mb-1.5 tracking-[0.18em] uppercase">
              今週末、どこ行く？
            </p>
            <h2 className="text-white text-[20px] font-extrabold leading-snug mb-2.5 drop-shadow-sm">
              子育て家族のための<br />低料金おでかけスポット
            </h2>
            <p className="text-white/75 text-[12px] leading-relaxed">
              市区町村・都道府県・国が運営する<br />安心・安全な公共施設を全国からご紹介
            </p>
          </div>
        </div>
      )}

      <div className="px-4 pt-5">
        {filtered.length === 0 && hasFilter ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[16px] font-bold text-[#1E3A2F] mb-2">
              条件に合う施設が見つかりません
            </p>
            <p className="text-[13px] text-[#88A898]">
              絞り込みを変えて、もう一度探してみてください！
            </p>
          </div>
        ) : (
          <FeedGrid facilities={filtered} />
        )}
      </div>
    </>
  )
}
