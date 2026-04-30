"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bookmark, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/",           label: "ホーム",       icon: Home     },
  { href: "/search",     label: "検索",         icon: Search   },
  { href: "/collection", label: "コレクション", icon: Bookmark },
  { href: "/settings",   label: "設定",         icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ background: "#FDFCFA", borderTop: "1px solid #DDD8CF" }}
    >
      <div className="flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors duration-300",
                active ? "text-[#191916]" : "text-[#A09890] hover:text-[#605A52]"
              )}
              aria-label={label}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2 : 1.5}
                className={active ? "text-[#191916]" : ""}
              />
              <span
                className={cn(
                  "text-[9px] tracking-[0.12em] font-medium",
                  active ? "text-[#191916]" : "text-[#A09890]"
                )}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#191916] opacity-40" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
