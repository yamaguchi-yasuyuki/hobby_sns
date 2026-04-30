"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import FilterModal from "./FilterModal"

type FilterButtonProps = {
  prefectures: string[]
}

export default function FilterButton({ prefectures }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  const activePrefs = searchParams.getAll("pref").length
  const hasKeyword  = !!searchParams.get("q")
  const activeCount = activePrefs + (hasKeyword ? 1 : 0)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex-shrink-0 flex items-center gap-1.5 py-1.5 px-3 text-[11px] tracking-[0.1em] font-medium transition-all duration-200",
          activeCount > 0
            ? "text-[#FDFCFA]"
            : "text-[#A09890] hover:text-[#191916]"
        )}
        style={
          activeCount > 0
            ? { background: "#1E3028" }
            : { border: "1px solid #DDD8CF", background: "transparent" }
        }
        aria-label="絞り込み"
      >
        <SlidersHorizontal size={12} strokeWidth={1.5} />
        <span>絞り込み</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <FilterModal
          prefectures={prefectures}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
