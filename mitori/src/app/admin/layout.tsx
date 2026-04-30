import Link from "next/link"
import { LayoutDashboard, FileText, BarChart2, Plus } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* 管理者ナビ */}
      <div className="bg-[#1a2f27] text-white px-4 py-2 flex items-center gap-4 text-sm overflow-x-auto">
        <span className="font-bold text-xs bg-white/20 px-2 py-0.5 rounded flex-shrink-0">
          ADMIN
        </span>
        {[
          { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
          { href: "/admin/contents", label: "コンテンツ", icon: FileText },
          { href: "/admin/contents/new", label: "新規登録", icon: Plus },
          { href: "/admin/analytics", label: "分析", icon: BarChart2 },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-1 flex-shrink-0 hover:text-white/80 transition-colors"
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
    </div>
  )
}
