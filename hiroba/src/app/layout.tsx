import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import "./globals.css"
import Header from "@/components/layout/Header"
import BottomNav from "@/components/layout/BottomNav"
import { BookmarkProvider } from "@/context/BookmarkContext"
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers"
import { formatSupabaseError } from "@/lib/supabase/errors"

export const metadata: Metadata = {
  title: "HIROBA — 子育て家族の「行きたい！」を見つけよう",
  description:
    "市区町村・都道府県・国が運営する安心・低料金の施設を全国から探せます。温泉・キャンプ場・公園・農業体験など、パパママと子どもが一緒に楽しめる公共施設をまとめてご紹介。週末のおでかけ先にぜひ。",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (userId) {
    try {
      await ensureSupabaseUser()
    } catch (e) {
      console.error(
        "[hiroba] Supabase ユーザー同期に失敗:",
        formatSupabaseError(e),
        e
      )
    }
  }

  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="bg-[#F5F9F5] min-h-screen">
          <BookmarkProvider>
            <Header />
            <main className="max-w-5xl mx-auto pb-28 md:pb-12 w-full [&:has(.admin-root-wide)]:max-w-none">
              {children}
            </main>
            <BottomNav />
          </BookmarkProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
