import type { Metadata } from "next"
import { Cormorant_Garamond } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import Header from "@/components/layout/Header"
import BottomNav from "@/components/layout/BottomNav"
import { BookmarkProvider } from "@/context/BookmarkContext"

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MITORI — 読むだけSNS",
  description:
    "発信しなくていい。40代男性のための、趣味のビジュアルフィード。キャンプ・温泉・バイク・古着など、眺めて気になるものをコレクション。",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ja" className={cormorant.variable}>
        <body className="bg-[#F3F0EB] min-h-screen">
          <BookmarkProvider>
            <Header />
            <main className="max-w-5xl mx-auto pb-24 md:pb-10">
              {children}
            </main>
            <BottomNav />
          </BookmarkProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
