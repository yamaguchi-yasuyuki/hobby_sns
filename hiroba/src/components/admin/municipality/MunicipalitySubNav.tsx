"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, List, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/admin/municipality", label: "ダッシュボード", icon: LayoutDashboard, key: "dash" as const },
  { href: "/admin/municipality/facilities", label: "施設一覧", icon: List, key: "list" as const },
  { href: "/admin/municipality/facilities/new", label: "新規登録", icon: Plus, key: "new" as const },
]

function navActive(pathname: string, key: "dash" | "list" | "new"): boolean {
  if (key === "dash") return pathname === "/admin/municipality"
  if (key === "new") return pathname === "/admin/municipality/facilities/new"
  return (
    pathname === "/admin/municipality/facilities" ||
    /^\/admin\/municipality\/facilities\/[^/]+\/edit$/.test(pathname)
  )
}

export default function MunicipalitySubNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex flex-wrap gap-2 py-3 border-b mb-6"
      style={{ borderColor: "#C8DDD0" }}
    >
      {items.map(({ href, label, icon: Icon, key }) => {
        const isActive = navActive(pathname, key)
        return (
          <Link
            key={key}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-colors",
              isActive
                ? "bg-[#1E7A4A] text-white shadow-sm"
                : "bg-white text-[#4A7060] border border-[#C8DDD0] hover:bg-[#E8F5ED]"
            )}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
