"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import FilterButton from "./FilterButton"
import type { Genre } from "@/types"

type GenreFilterBarProps = {
  genres: Genre[]
  prefectures: string[]
}

export default function GenreFilterBar({ genres, prefectures }: GenreFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeGenre = searchParams.get("genre") ?? "all"
  const activePrefs = searchParams.getAll("pref")
  const activeQ = searchParams.get("q") ?? ""

  const handleGenreSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === "all") params.delete("genre")
    else params.set("genre", slug)
    router.push(`/?${params.toString()}`)
  }

  const removePref = (pref: string) => {
    const params = new URLSearchParams()
    const genre = searchParams.get("genre")
    if (genre) params.set("genre", genre)
    activePrefs.filter((p) => p !== pref).forEach((p) => params.append("pref", p))
    if (activeQ) params.set("q", activeQ)
    router.push(`/?${params.toString()}`)
  }

  const removeKeyword = () => {
    const params = new URLSearchParams()
    const genre = searchParams.get("genre")
    if (genre) params.set("genre", genre)
    activePrefs.forEach((p) => params.append("pref", p))
    router.push(`/?${params.toString()}`)
  }

  const allTabs = [{ id: "all", name: "すべて", slug: "all" }, ...genres]

  return (
    <div
      className="sticky top-14 z-40"
      style={{ background: "#F3F0EB", borderBottom: "1px solid #DDD8CF" }}
    >
      {/* ── ジャンルタブ行 ── */}
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center gap-1">
          {/* スクロール可能なタブ */}
          <div className="flex overflow-x-auto no-scrollbar flex-1">
            {allTabs.map((genre) => {
              const active =
                genre.slug === "all"
                  ? activeGenre === "all"
                  : activeGenre === genre.slug
              return (
                <button
                  key={genre.slug}
                  onClick={() => handleGenreSelect(genre.slug)}
                  className={cn(
                    "flex-shrink-0 px-3.5 py-3.5 text-[11px] tracking-[0.12em] font-medium transition-all duration-200 border-b-2",
                    active
                      ? "border-[#191916] text-[#191916]"
                      : "border-transparent text-[#A09890] hover:text-[#605A52]"
                  )}
                >
                  {genre.name}
                </button>
              )
            })}
          </div>

          {/* 縦区切り */}
          <div className="w-px h-4 flex-shrink-0" style={{ background: "#DDD8CF" }} />

          {/* 絞り込みボタン */}
          <div className="flex-shrink-0 pl-3 pr-1">
            <FilterButton prefectures={prefectures} />
          </div>
        </div>
      </div>

      {/* ── アクティブフィルタータグ ── */}
      {(activePrefs.length > 0 || activeQ) && (
        <div className="max-w-5xl mx-auto px-5 pb-2.5">
          <div className="flex gap-1.5 flex-wrap">
            {activePrefs.map((pref) => (
              <span
                key={pref}
                className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium tracking-[0.05em] text-[#9B7D58]"
                style={{ border: "1px solid #DDD8CF", background: "rgba(155,125,88,0.07)" }}
              >
                {pref}
                <button
                  onClick={() => removePref(pref)}
                  className="hover:text-[#191916] transition-colors ml-0.5"
                  aria-label={`${pref}を解除`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            {activeQ && (
              <span
                className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium tracking-[0.05em] text-[#9B7D58]"
                style={{ border: "1px solid #DDD8CF", background: "rgba(155,125,88,0.07)" }}
              >
                「{activeQ}」
                <button
                  onClick={removeKeyword}
                  className="hover:text-[#191916] transition-colors ml-0.5"
                  aria-label="キーワードを解除"
                >
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
