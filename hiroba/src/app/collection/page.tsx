"use client"

import Link from "next/link"
import { Bookmark, CloudOff } from "lucide-react"
import FeedGrid from "@/components/feed/FeedGrid"
import { mockFacilities } from "@/lib/mock-data"
import { useBookmarks } from "@/context/BookmarkContext"
import { useUser } from "@clerk/nextjs"

export default function CollectionPage() {
  const { bookmarkedIds } = useBookmarks()
  const { isSignedIn } = useUser()

  const bookmarkedFacilities = mockFacilities.filter((f) => bookmarkedIds.has(f.id))

  return (
    <div className="px-4 pt-5">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[13px] font-bold text-[#1E7A4A] hover:underline"
        >
          ← すべての施設を見る（トップ）
        </Link>
      </div>
      <div className="flex items-center gap-2.5 mb-5">
        <Bookmark size={22} className="text-[#F5883C]" fill="currentColor" />
        <h1 className="text-[18px] font-extrabold text-[#1E3A2F]">お気に入り</h1>
        {bookmarkedFacilities.length > 0 && (
          <span
            className="ml-auto text-[12px] font-bold px-3 py-1 rounded-full"
            style={{ background: "#E8F5ED", color: "#1E7A4A" }}
          >
            {bookmarkedFacilities.length}件
          </span>
        )}
      </div>

      {/* 未ログイン時の同期バナー */}
      {!isSignedIn && bookmarkedFacilities.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-5"
          style={{ background: "#FEF0E7", border: "2px solid #F5C89A" }}
        >
          <CloudOff size={18} strokeWidth={2} className="text-[#F5883C] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#1E3A2F] leading-snug">
              この端末にのみ保存されています
            </p>
            <p className="text-[12px] text-[#88A898] leading-snug mt-0.5">
              登録するとスマホ・PCどこからでも確認できます
            </p>
          </div>
          <Link
            href="/sign-up"
            className="shrink-0 px-3.5 py-2 rounded-full text-[12px] font-bold transition-colors hover:opacity-80"
            style={{ background: "#F5883C", color: "#FFFFFF" }}
          >
            無料登録
          </Link>
        </div>
      )}

      {bookmarkedFacilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🌿</div>
          <p className="text-[16px] font-bold text-[#1E3A2F] mb-2">
            まだ保存した施設がありません
          </p>
          <p className="text-[13px] text-[#88A898] mb-6">
            気になる施設を♡でお気に入り登録しましょう
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-white text-[14px] font-bold shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "#1E7A4A" }}
          >
            施設を探す
          </Link>
        </div>
      ) : (
        <FeedGrid facilities={bookmarkedFacilities} />
      )}
    </div>
  )
}
