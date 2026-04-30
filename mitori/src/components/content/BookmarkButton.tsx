"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBookmarks } from "@/context/BookmarkContext"
import { useUser } from "@clerk/nextjs"

type BookmarkButtonProps = {
  contentId: string
  initialIsBookmarked?: boolean
  className?: string
}

export default function BookmarkButton({ contentId, className }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks()
  const { isSignedIn } = useUser()
  const bookmarked = isBookmarked(contentId)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNudge, setShowNudge] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    toggle(contentId)
    setTimeout(() => setIsAnimating(false), 350)

    // 未ログインで初めて保存したときにナッジを表示
    if (!isSignedIn && !bookmarked) {
      setShowNudge(true)
      setTimeout(() => setShowNudge(false), 6000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        aria-label={bookmarked ? "コレクションから削除" : "コレクションに保存"}
        className={cn(
          "p-1.5 transition-all duration-300",
          isAnimating && "scale-125",
          className
        )}
        style={{ background: "rgba(253,252,250,0.85)", backdropFilter: "blur(4px)" }}
      >
        <Bookmark
          size={17}
          strokeWidth={1.5}
          className={cn(
            "transition-colors duration-300",
            bookmarked ? "fill-[#9B7D58] text-[#9B7D58]" : "text-[#605A52]"
          )}
        />
      </button>

      {/* 未登録ナッジトースト */}
      {showNudge && (
        <div
          className="fixed bottom-24 left-4 right-4 z-[200] mx-auto max-w-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 animate-modal-in"
          style={{ background: "#1E3028", color: "#FDFCFA" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark size={16} strokeWidth={1.5} className="fill-[#9B7D58] text-[#9B7D58] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium leading-snug">
              コレクションに保存しました
            </p>
            <p className="text-[11px] text-white/60 leading-snug mt-0.5">
              登録するとどのデバイスでも確認できます
            </p>
          </div>
          <Link
            href="/sign-up"
            className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-[0.05em] transition-colors hover:opacity-80"
            style={{ background: "#2D4A3E", color: "#A8D4B8" }}
            onClick={() => setShowNudge(false)}
          >
            登録する
          </Link>
          <button
            onClick={() => setShowNudge(false)}
            className="shrink-0 text-white/40 hover:text-white/70 transition-colors"
            aria-label="閉じる"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  )
}
