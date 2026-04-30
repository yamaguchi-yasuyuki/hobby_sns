"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bookmark, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/",           label: "ホーム",       icon: Home     },
  { href: "/search",     label: "さがす",        icon: Search   },
  { href: "/collection", label: "お気に入り",   icon: Bookmark },
  { href: "/settings",   label: "設定",          icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ background: "#FFFFFF", borderTop: "2px solid #C8DDD0" }}
    >
      <div className="flex pb-safe">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200",
                active ? "text-[#1E7A4A]" : "text-[#88A898] hover:text-[#4A7060]"
              )}
              aria-label={label}
            >
              <div
                className={cn(
                  "w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200",
                  active ? "bg-[#E8F5ED]" : "bg-transparent"
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-[#1E7A4A] font-bold" : "text-[#88A898]"
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
