"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, ChevronRight, LogIn, LayoutGrid } from "lucide-react"
import { mockCategories } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [selectedCats, setSelectedCats] = useState<string[]>(["onsen", "camp", "park"])

  const toggleCat = (slug: string) => {
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={20} className="text-[#1A4B7A]" />
        <h1 className="text-lg font-bold text-[#1A2538]">設定</h1>
      </div>

      {/* ログイン案内 */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-[#D1DCE8]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#1A2538]">ログイン / 新規登録</p>
            <p className="text-xs text-[#8AA0B4] mt-0.5">お気に入り機能を使うにはログインが必要です</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium"
            style={{ background: "#1A4B7A" }}
          >
            <LogIn size={15} />
            ログイン
          </button>
        </div>
      </div>

      {/* カテゴリ表示設定 */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-[#D1DCE8]">
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid size={16} className="text-[#1A4B7A]" />
          <h2 className="text-sm font-semibold text-[#1A2538]">表示する施設カテゴリ</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCat(cat.slug)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                selectedCats.includes(cat.slug)
                  ? "text-white"
                  : "text-[#8AA0B4] hover:bg-[#E5EEF5]"
              )}
              style={
                selectedCats.includes(cat.slug)
                  ? { background: "#1A4B7A" }
                  : { background: "#EFF3F8" }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#B0C4D4] mt-3">
          {selectedCats.length}個のカテゴリを選択中
        </p>
      </div>

      {/* その他メニュー */}
      <div className="bg-white rounded-xl border border-[#D1DCE8] overflow-hidden mb-4">
        {[
          { label: "プライバシーポリシー", href: "#" },
          { label: "利用規約", href: "#" },
          { label: "施設情報の掲載について", href: "#" },
          { label: "お問い合わせ", href: "#" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-4 py-3.5 border-b border-[#D1DCE8] last:border-none hover:bg-[#EFF3F8] transition-colors"
          >
            <span className="text-sm text-[#1A2538]">{label}</span>
            <ChevronRight size={16} className="text-[#B0C4D4]" />
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-[#B0C4D4] mt-4">HIROBA v0.1.0</p>
    </div>
  )
}
