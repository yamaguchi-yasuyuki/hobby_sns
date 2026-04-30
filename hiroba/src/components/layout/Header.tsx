"use client"

import Link from "next/link"
import { UserCircle, LogOut, Bookmark, TreePine } from "lucide-react"
import { useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"

export default function Header() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = user?.firstName ?? user?.username ?? user?.emailAddresses[0]?.emailAddress ?? "U"
  const initial = displayName.slice(0, 1).toUpperCase()

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "#1E7A4A", borderBottom: "3px solid #145C38" }}
    >
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* ブランドロゴ */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#145C38" }}
          >
            <TreePine size={18} color="#7FD4A0" strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-bold tracking-[0.18em] text-[18px] leading-none">
              HIROBA
            </span>
            <span className="text-white/60 text-[10px] tracking-[0.1em] leading-none font-medium">
              家族のおでかけ、ここから探そう
            </span>
          </div>
        </Link>

        {/* 右側：お気に入り（デスクトップはヘッダー1本。モバイルは下タブ）＋ユーザーメニュー */}
        <div className="flex items-center gap-2">
          <Link
            href="/collection"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold text-white/95 hover:bg-white/10 transition-colors border border-white/25"
          >
            <Bookmark size={15} strokeWidth={2} className="text-[#7FD4A0]" />
            お気に入り
          </Link>
          <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                aria-label="メニュー"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold"
                  style={{ background: "#145C38", color: "#7FD4A0" }}
                >
                  {initial}
                </div>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    className="absolute right-0 top-12 z-50 w-56 rounded-2xl overflow-hidden shadow-xl"
                    style={{ background: "#FFFFFF", border: "2px solid #C8DDD0" }}
                  >
                    <div
                      className="px-4 py-3.5"
                      style={{ borderBottom: "1px solid #E0EEE6" }}
                    >
                      <p className="text-[13px] font-bold text-[#1E3A2F] truncate">{displayName}</p>
                      <p className="text-[11px] text-[#88A898] truncate mt-0.5">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    <Link
                      href="/collection"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 text-[13px] font-medium text-[#1E3A2F] hover:bg-[#F5F9F5] transition-colors"
                    >
                      <Bookmark size={16} strokeWidth={2} color="#1E7A4A" />
                      お気に入り施設
                    </Link>
                    <button
                      onClick={() => { signOut(); setMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-[13px] font-medium text-[#88A898] hover:bg-[#F5F9F5] transition-colors"
                      style={{ borderTop: "1px solid #E0EEE6" }}
                    >
                      <LogOut size={16} strokeWidth={2} />
                      ログアウト
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.05em] transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "#145C38", color: "#7FD4A0" }}
            >
              <UserCircle size={15} strokeWidth={2} />
              登録 / ログイン
            </Link>
          )}
          </div>
        </div>
      </div>
    </header>
  )
}
