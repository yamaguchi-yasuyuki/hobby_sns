"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, Check, Search, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterModalProps = {
  prefectures: string[]
  onClose: () => void
}

export default function FilterModal({ prefectures, onClose }: FilterModalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(
    searchParams.getAll("pref")
  )
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "")

  const activeCount = selectedPrefs.length + (keyword.trim() ? 1 : 0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const togglePref = (pref: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const handleReset = () => { setSelectedPrefs([]); setKeyword("") }

  const handleApply = () => {
    const params = new URLSearchParams()
    const cat = searchParams.get("cat")
    if (cat) params.set("cat", cat)
    selectedPrefs.forEach((p) => params.append("pref", p))
    if (keyword.trim()) params.set("q", keyword.trim())
    router.push(`/?${params.toString()}`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-backdrop-in"
      style={{ backgroundColor: "rgba(10,20,35,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md sm:mx-4 bg-[#FAFCFE] overflow-hidden flex flex-col animate-modal-in"
        style={{ maxHeight: "85dvh", borderTop: "3px solid #1A4B7A" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #E5EEF5" }}
        >
          <div>
            <h2 className="font-serif text-[16px] font-light text-[#1A2538] tracking-[0.05em]">絞り込み</h2>
            {activeCount > 0 && (
              <p className="text-[11px] text-[#8AA0B4] tracking-[0.05em] mt-0.5">
                {activeCount}件の条件を設定中
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8AA0B4] hover:text-[#1A2538] transition-colors duration-200"
            aria-label="閉じる"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* スクロールエリア */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

          {/* ① 都道府県（複数選択） */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={13} strokeWidth={1.5} className="text-[#B8792A]" />
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#4A6070]">都道府県</h3>
              {selectedPrefs.length > 0 && (
                <span className="ml-auto text-[11px] text-[#B8792A] tracking-[0.05em]">
                  {selectedPrefs.length}件選択
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {prefectures.map((pref) => {
                const checked = selectedPrefs.includes(pref)
                return (
                  <button
                    key={pref}
                    onClick={() => togglePref(pref)}
                    className={cn(
                      "flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-left transition-all duration-200",
                      checked
                        ? "text-[#0F2B4A]"
                        : "text-[#4A6070] hover:text-[#1A2538]"
                    )}
                    style={{
                      border: checked ? "1px solid #1A4B7A" : "1px solid #D1DCE8",
                      background: checked ? "rgba(26,75,122,0.07)" : "transparent",
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center transition-all duration-200"
                      style={{
                        border: checked ? "1.5px solid #1A4B7A" : "1.5px solid #D1DCE8",
                        background: checked ? "#1A4B7A" : "transparent",
                      }}
                    >
                      {checked && <Check size={8} className="text-white" strokeWidth={3} />}
                    </div>
                    {pref}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ② キーワード */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Search size={13} strokeWidth={1.5} className="text-[#B8792A]" />
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#4A6070]">キーワード</h3>
            </div>
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="施設名・地名で検索"
              className="w-full px-4 py-3 text-[13px] text-[#1A2538] placeholder:text-[#B0C4D4] focus:outline-none transition-all duration-200"
              style={{
                background: "#EFF3F8",
                border: "1px solid #D1DCE8",
              }}
            />
          </section>
        </div>

        {/* フッター */}
        <div
          className="px-6 py-4 flex gap-3"
          style={{ borderTop: "1px solid #E5EEF5" }}
        >
          <button
            onClick={handleReset}
            className="px-5 py-3 text-[11px] tracking-[0.1em] font-medium text-[#8AA0B4] hover:text-[#1A2538] transition-colors duration-200"
            style={{ border: "1px solid #D1DCE8" }}
          >
            リセット
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 text-[12px] tracking-[0.12em] font-medium text-[#FAFCFE] hover:opacity-80 transition-opacity duration-200"
            style={{ background: "#0F2B4A" }}
          >
            {activeCount > 0 ? `この条件で絞り込む` : "絞り込む"}
          </button>
        </div>
      </div>
    </div>
  )
}
