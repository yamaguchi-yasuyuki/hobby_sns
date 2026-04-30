"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBookmarks } from "@/context/BookmarkContext"
import { useUser } from "@clerk/nextjs"

type BookmarkButtonProps = {
  facilityId: string
  initialIsBookmarked?: boolean
  className?: string
}

export default function BookmarkButton({ facilityId, className }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks()
  const { isSignedIn } = useUser()
  const bookmarked = isBookmarked(facilityId)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNudge, setShowNudge] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    toggle(facilityId)
    setTimeout(() => setIsAnimating(false), 350)

    if (!isSignedIn && !bookmarked) {
      setShowNudge(true)
      setTimeout(() => setShowNudge(false), 6000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        aria-label={bookmarked ? "お気に入りから削除" : "お気に入りに追加"}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          isAnimating && "scale-125",
          className
        )}
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)" }}
      >
        <Bookmark
          size={18}
          strokeWidth={2}
          className={cn(
            "transition-colors duration-300",
            bookmarked ? "fill-[#F5883C] text-[#F5883C]" : "text-[#4A7060]"
          )}
        />
      </button>

      {showNudge && (
        <div
          className="fixed bottom-24 left-4 right-4 z-[200] mx-auto max-w-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 animate-modal-in"
          style={{ background: "#1E7A4A", color: "#FFFFFF" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark size={16} strokeWidth={2} className="fill-[#F5883C] text-[#F5883C] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium leading-snug">
              お気に入りに追加しました
            </p>
            <p className="text-[11px] text-white/60 leading-snug mt-0.5">
              登録するとどのデバイスでも確認できます
            </p>
          </div>
          <Link
            href="/sign-up"
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors hover:opacity-80"
            style={{ background: "#F5883C", color: "#FFFFFF" }}
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
