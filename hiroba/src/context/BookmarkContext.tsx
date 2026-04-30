"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { useUser } from "@clerk/nextjs"
import { mockBookmarks } from "@/lib/mock-data"
import { toggleBookmarkAction, getBookmarkIdsAction } from "@/actions/bookmark"
import { formatSupabaseError, isStaleNextServerActionError } from "@/lib/supabase/errors"

function logBookmarkServerError(context: string, err: unknown) {
  console.error(`[hiroba] ${context}:`, formatSupabaseError(err), err)
  if (isStaleNextServerActionError(err)) {
    console.warn(
      "[hiroba] Server Action の ID がサーバーと一致していません（開発時のキャッシュずれ）。\n" +
        "→ hiroba で dev サーバーをすべて止める → .next フォルダを削除 → npm run dev を1つだけ起動 → ブラウザでスーパーリロード（Ctrl+Shift+R）。\n" +
        "→ 3000 と 3001 のように Next を二重起動している場合はどちらかに統一してください。"
    )
  }
}

const STORAGE_KEY = "hiroba_bookmarks"

function getLocalIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as string[]
      if (Array.isArray(parsed)) return new Set(parsed)
    }
  } catch {
    // ignore
  }
  return new Set(mockBookmarks.map((b) => b.facility.id))
}

type BookmarkContextValue = {
  bookmarkedIds: Set<string>
  isBookmarked: (id: string) => boolean
  toggle: (id: string) => void
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null)

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useUser()
  /** ログイン時は空から同期（mock の仮お気に入りで上書きしない）。未ログインは effect で localStorage を読む */
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set())
  const [initialized, setInitialized] = useState(false)

  // Clerk の読み込みが完了したら初期化
  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) {
      getBookmarkIdsAction()
        .then((ids) => {
          setBookmarkedIds(new Set(ids))
          setInitialized(true)
        })
        .catch((err) => {
          logBookmarkServerError("お気に入り取得 / ユーザー同期に失敗", err)
          setBookmarkedIds(new Set())
          setInitialized(true)
        })
    } else {
      // 未ログイン → localStorage（なければデモ用 mock）
      setBookmarkedIds(getLocalIds())
      setInitialized(true)
    }
  }, [isSignedIn, isLoaded])

  // 未ログイン時のみ localStorage に同期
  useEffect(() => {
    if (!initialized || isSignedIn) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarkedIds]))
    } catch {
      // ignore
    }
  }, [bookmarkedIds, initialized, isSignedIn])

  const isBookmarked = useCallback(
    (id: string) => bookmarkedIds.has(id),
    [bookmarkedIds]
  )

  const toggle = useCallback((id: string) => {
    let rollback: Set<string> | null = null
    setBookmarkedIds((prev) => {
      rollback = new Set(prev)
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

    if (isSignedIn) {
      toggleBookmarkAction(id)
        .then(() => getBookmarkIdsAction())
        .then((ids) => setBookmarkedIds(new Set(ids)))
        .catch((err) => {
          logBookmarkServerError("お気に入りの更新に失敗", err)
          if (rollback) setBookmarkedIds(rollback)
        })
    }
  }, [isSignedIn])

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
