"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { mockGenres } from "@/lib/mock-data"

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  const toggleGenre = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const handleStart = () => {
    if (selected.length > 0) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">
          興味のあるジャンルを選んでください
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-8">
          選んだジャンルのコンテンツが優先的に表示されます。後から変更できます。
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {mockGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.slug)}
              className={cn(
                "py-4 rounded-xl text-sm font-medium border-2 transition-all",
                selected.includes(genre.slug)
                  ? "border-[#2D4A3E] bg-[#2D4A3E] text-white"
                  : "border-[#E2DED8] bg-white text-[#2C2C2C] hover:border-[#2D4A3E]"
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          disabled={selected.length === 0}
          className={cn(
            "w-full py-4 rounded-xl font-semibold text-base transition-all",
            selected.length > 0
              ? "bg-[#2D4A3E] text-white hover:bg-[#243d33]"
              : "bg-[#E2DED8] text-[#A0A0A0] cursor-not-allowed"
          )}
        >
          {selected.length > 0
            ? `${selected.length}個のジャンルで始める`
            : "ジャンルを選んでください"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-3 py-2 text-sm text-[#A0A0A0] hover:text-[#6B6B6B]"
        >
          スキップ（後で設定する）
        </button>
      </div>
    </div>
  )
}
