"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import FilterButton from "./FilterButton"
import type { Category } from "@/types"

type CategoryFilterBarProps = {
  categories: Category[]
  prefectures: string[]
}

const CATEGORY_EMOJI: Record<string, string> = {
  all:     "🗺️",
  onsen:   "♨️",
  camp:    "⛺",
  sports:  "🏊",
  culture: "🎨",
  park:    "🌳",
  lodge:   "🏠",
  farm:    "🌾",
  water:   "🏖️",
}

export default function CategoryFilterBar({ categories, prefectures }: CategoryFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCat  = searchParams.get("cat") ?? "all"
  const activePrefs = searchParams.getAll("pref")
  const activeQ    = searchParams.get("q") ?? ""

  const handleCatSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === "all") params.delete("cat")
    else params.set("cat", slug)
    router.push(`/?${params.toString()}`)
  }

  const removePref = (pref: string) => {
    const params = new URLSearchParams()
    const cat = searchParams.get("cat")
    if (cat) params.set("cat", cat)
    activePrefs.filter((p) => p !== pref).forEach((p) => params.append("pref", p))
    if (activeQ) params.set("q", activeQ)
    router.push(`/?${params.toString()}`)
  }

  const removeKeyword = () => {
    const params = new URLSearchParams()
    const cat = searchParams.get("cat")
    if (cat) params.set("cat", cat)
    activePrefs.forEach((p) => params.append("pref", p))
    router.push(`/?${params.toString()}`)
  }

  const allTabs = [{ id: "all", name: "すべて", slug: "all" }, ...categories]

  return (
    <div
      className="sticky top-16 z-40"
      style={{ background: "#F5F9F5", borderBottom: "2px solid #C8DDD0" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-1">
          <div className="flex overflow-x-auto no-scrollbar flex-1 gap-1 py-2">
            {allTabs.map((cat) => {
              const active =
                cat.slug === "all"
                  ? activeCat === "all"
                  : activeCat === cat.slug
              const emoji = CATEGORY_EMOJI[cat.slug] ?? "📍"
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCatSelect(cat.slug)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all duration-200 whitespace-nowrap",
                    active
                      ? "bg-[#1E7A4A] text-white shadow-md"
                      : "bg-white text-[#4A7060] hover:bg-[#E8F5ED] border border-[#C8DDD0]"
                  )}
                >
                  <span className="text-[14px] leading-none">{emoji}</span>
                  {cat.name}
                </button>
              )
            })}
          </div>

          <div className="w-px h-6 flex-shrink-0 mx-2" style={{ background: "#C8DDD0" }} />

          <div className="flex-shrink-0 pr-1">
            <FilterButton prefectures={prefectures} />
          </div>
        </div>
      </div>

      {(activePrefs.length > 0 || activeQ) && (
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex gap-2 flex-wrap">
            {activePrefs.map((pref) => (
              <span
                key={pref}
                className="flex items-center gap-1.5 px-3 py-1 text-[12px] font-bold rounded-full text-[#1E7A4A]"
                style={{ border: "2px solid #C8DDD0", background: "#E8F5ED" }}
              >
                📍 {pref}
                <button
                  onClick={() => removePref(pref)}
                  className="hover:text-[#145C38] transition-colors"
                  aria-label={`${pref}を解除`}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </span>
            ))}
            {activeQ && (
              <span
                className="flex items-center gap-1.5 px-3 py-1 text-[12px] font-bold rounded-full text-[#1E7A4A]"
                style={{ border: "2px solid #C8DDD0", background: "#E8F5ED" }}
              >
                🔍 「{activeQ}」
                <button
                  onClick={removeKeyword}
                  className="hover:text-[#145C38] transition-colors"
                  aria-label="キーワードを解除"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
