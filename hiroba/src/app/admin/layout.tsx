import type { ReactNode } from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-root-wide min-h-[calc(100dvh-4rem)] w-full text-[#1E3A2F] relative z-0">
      <div
        className="text-center text-[11px] font-bold tracking-[0.12em] py-2 text-white"
        style={{ background: "#145C38" }}
      >
        管理画面
        <Link href="/admin" className="ml-3 text-[#7FD4A0] font-medium hover:underline">
          入口
        </Link>
        <Link href="/" className="ml-3 text-[#7FD4A0] font-medium hover:underline">
          一般サイトへ
        </Link>
      </div>
      {children}
    </div>
  )
}
