"use client"

import Link from "next/link"
import { UserCircle, LogOut, Bookmark } from "lucide-react"
import { useState } from "react"
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Header() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = user?.firstName ?? user?.username ?? user?.emailAddresses[0]?.emailAddress ?? "U"
  const initial = displayName.slice(0, 1).toUpperCase()

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "#191916", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* ブランドロゴ */}
        <Link href="/" className="flex flex-col gap-px">
          <span className="font-serif text-white font-light tracking-[0.5em] text-[17px] leading-none">
            MITORI
          </span>
          <span className="text-white/30 text-[9px] tracking-[0.25em] font-light leading-none">
            読むだけSNS
          </span>
        </Link>

        {/* 右側：ユーザーメニュー */}
        <div className="relative">
          <SignedIn>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200"
              aria-label="メニュー"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium tracking-wider"
                style={{ background: "#2D4A3E", color: "#A8D4B8" }}
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
                  className="absolute right-0 top-10 z-50 w-52 rounded-xl overflow-hidden shadow-lg"
                  style={{ background: "#FDFCFA", border: "1px solid #E2DED8" }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid #EEEAE4" }}
                  >
                    <p className="text-[12px] font-medium text-[#191916] truncate">{displayName}</p>
                    <p className="text-[10px] text-[#A09890] truncate mt-0.5">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                  <Link
                    href="/collection"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#605A52] hover:bg-[#F7F5F2] transition-colors"
                  >
                    <Bookmark size={14} strokeWidth={1.5} />
                    コレクション
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#A09890] hover:bg-[#F7F5F2] transition-colors"
                    style={{ borderTop: "1px solid #EEEAE4" }}
                  >
                    <LogOut size={14} strokeWidth={1.5} />
                    ログアウト
                  </button>
                </div>
              </>
            )}
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.08em] transition-all duration-200 hover:opacity-80"
              style={{ background: "#2D4A3E", color: "#A8D4B8" }}
            >
              <UserCircle size={14} strokeWidth={1.5} />
              登録 / ログイン
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
