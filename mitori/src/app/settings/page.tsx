"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, ChevronRight, LogIn, Grid3X3 } from "lucide-react"
import { mockGenres } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["camp", "onsen", "vintage"])

  const toggleGenre = (slug: string) => {
    setSelectedGenres((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={20} className="text-[#2D4A3E]" />
        <h1 className="text-lg font-bold text-[#2C2C2C]">設定</h1>
      </div>

      {/* ログイン案内 */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-[#E2DED8]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#2C2C2C]">ログイン / 新規登録</p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">コレクション機能を使うにはログインが必要です</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D4A3E] text-white text-sm font-medium">
            <LogIn size={15} />
            ログイン
          </button>
        </div>
      </div>

      {/* ジャンル設定 */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-[#E2DED8]">
        <div className="flex items-center gap-2 mb-3">
          <Grid3X3 size={16} className="text-[#2D4A3E]" />
          <h2 className="text-sm font-semibold text-[#2C2C2C]">表示するジャンル</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {mockGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.slug)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                selectedGenres.includes(genre.slug)
                  ? "bg-[#2D4A3E] text-white"
                  : "bg-[#EFEDE9] text-[#6B6B6B] hover:bg-[#E2DED8]"
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#A0A0A0] mt-3">
          {selectedGenres.length}個のジャンルを選択中
        </p>
      </div>

      {/* その他メニュー */}
      <div className="bg-white rounded-xl border border-[#E2DED8] overflow-hidden mb-4">
        {[
          { label: "プライバシーポリシー", href: "#" },
          { label: "利用規約", href: "#" },
          { label: "お問い合わせ", href: "#" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-4 py-3.5 border-b border-[#E2DED8] last:border-none hover:bg-[#F7F5F2] transition-colors"
          >
            <span className="text-sm text-[#2C2C2C]">{label}</span>
            <ChevronRight size={16} className="text-[#A0A0A0]" />
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-[#A0A0A0] mt-4">MITORI v0.1.0</p>
    </div>
  )
}
