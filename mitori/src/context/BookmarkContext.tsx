"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { mockBookmarks } from "@/lib/mock-data"

const STORAGE_KEY = "mitori_bookmarks"

// 初期値：mockBookmarks に含まれるコンテンツIDのSet
function getInitialIds(): Set<string> {
  if (typeof window === "undefined") {
    return new Set(mockBookmarks.map((b) => b.content.id))
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as string[]
      if (Array.isArray(parsed)) return new Set(parsed)
    }
  } catch {
    // ignore
  }
  // 初回アクセス時はモックデータのブックマークをデフォルトとして使う
  return new Set(mockBookmarks.map((b) => b.content.id))
}

type BookmarkContextValue = {
  bookmarkedIds: Set<string>
  isBookmarked: (id: string) => boolean
  toggle: (id: string) => void
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null)

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set(mockBookmarks.map((b) => b.content.id))
  )

  // クライアントサイドで localStorage から読み込む
  useEffect(() => {
    setBookmarkedIds(getInitialIds())
  }, [])

  // Set が変わるたびに localStorage に書き込む
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarkedIds]))
    } catch {
      // ignore
    }
  }, [bookmarkedIds])

  const isBookmarked = useCallback(
    (id: string) => bookmarkedIds.has(id),
    [bookmarkedIds]
  )

  const toggle = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <BookmarkContext.Provider value={{ bookmarkedIds, isBookmarked, toggle }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks(): BookmarkContextValue {
  const ctx = useContext(BookmarkContext)
  if (!ctx) throw new Error("useBookmarks must be used inside <BookmarkProvider>")
  return ctx
}
