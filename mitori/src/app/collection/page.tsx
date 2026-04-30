"use client"

import Link from "next/link"
import { Bookmark, CloudOff } from "lucide-react"
import FeedGrid from "@/components/feed/FeedGrid"
import { mockContents } from "@/lib/mock-data"
import { useBookmarks } from "@/context/BookmarkContext"
import { useUser } from "@clerk/nextjs"

export default function CollectionPage() {
  const { bookmarkedIds } = useBookmarks()
  const { isSignedIn } = useUser()

  const bookmarkedContents = mockContents.filter((c) => bookmarkedIds.has(c.id))

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark size={20} className="text-[#8B6F47]" fill="currentColor" />
        <h1 className="text-lg font-bold text-[#2C2C2C]">コレクション</h1>
        {bookmarkedContents.length > 0 && (
          <span className="ml-auto text-sm text-[#A0A0A0]">
            {bookmarkedContents.length}件
          </span>
        )}
      </div>

      {/* 未ログイン時の同期バナー */}
      {!isSignedIn && bookmarkedContents.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
          style={{ background: "#F0EDE8", border: "1px solid #DDD8CF" }}
        >
          <CloudOff size={16} strokeWidth={1.5} className="text-[#8B6F47] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#2C2C2C] leading-snug">
              現在この端末にのみ保存されています
            </p>
            <p className="text-[11px] text-[#A09890] leading-snug mt-0.5">
              登録するとスマホ・PCどこからでも確認できます
            </p>
          </div>
          <Link
            href="/sign-up"
            className="shrink-0 px-3 py-2 rounded-lg text-[11px] font-medium tracking-[0.05em] transition-colors hover:opacity-80"
            style={{ background: "#1E3028", color: "#A8D4B8" }}
          >
            無料登録
          </Link>
        </div>
      )}

      {bookmarkedContents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#A0A0A0]">
          <Bookmark size={40} strokeWidth={1} className="mb-3" />
          <p className="text-base">まだ保存したコンテンツがありません</p>
          <p className="text-sm mt-1">フィードで気になるものを保存しましょう</p>
          <Link
            href="/"
            className="mt-4 px-5 py-2 rounded-full bg-[#2D4A3E] text-white text-sm font-medium"
          >
            フィードを見る
          </Link>
        </div>
      ) : (
        <FeedGrid contents={bookmarkedContents} />
      )}
    </div>
  )
}
