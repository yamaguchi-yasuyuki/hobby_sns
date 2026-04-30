import Image from "next/image"
import { MapPin, Images, ExternalLink } from "lucide-react"
import BookmarkButton from "@/components/content/BookmarkButton"
import type { Content, LinkType, SourceType } from "@/types"

type ContentCardProps = {
  content: Content
  onClick?: () => void
}

const SOURCE_LABELS: Record<SourceType, string> = {
  note:      "note",
  youtube:   "YouTube",
  x:         "X",
  instagram: "Instagram",
  blog:      "Blog",
  other:     "Link",
}

const SOURCE_COLORS: Record<SourceType, string> = {
  note:      "bg-[#41C9B4]/90 text-white",
  youtube:   "bg-red-500/90 text-white",
  x:         "bg-black/75 text-white",
  instagram: "bg-pink-500/85 text-white",
  blog:      "bg-gray-500/75 text-white",
  other:     "bg-gray-500/75 text-white",
}

const LINK_LABELS: Record<LinkType, string> = {
  note:    "note",
  youtube: "YouTube",
  amazon:  "Amazon",
  shop:    "Shop",
  website: "Web",
  other:   "Link",
}

const LINK_COLORS: Record<LinkType, string> = {
  note:    "bg-[#E8FAF7] text-[#41C9B4] border-[#41C9B4]/30",
  youtube: "bg-red-50 text-red-500 border-red-200",
  amazon:  "bg-amber-50 text-amber-600 border-amber-200",
  shop:    "bg-blue-50 text-blue-500 border-blue-200",
  website: "bg-gray-50 text-gray-500 border-gray-200",
  other:   "bg-gray-50 text-gray-500 border-gray-200",
}

export default function ContentCard({ content, onClick }: ContentCardProps) {
  const uniqueLinkTypes = content.links
    ? [...new Set(content.links.map((l) => l.type))]
    : []

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className="group block bg-white overflow-hidden cursor-pointer transition-all duration-500"
      style={{ border: "1px solid #DDD8CF" }}
    >
      {/* ── 写真エリア ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F0EB]">
        <Image
          src={content.image_url}
          alt={content.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* 下部グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

        {/* ソースタイプバッジ（左上） */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-0.5 text-[9px] font-semibold tracking-[0.06em] px-2 py-0.5 rounded-full backdrop-blur-sm ${SOURCE_COLORS[content.source_type]}`}
          >
            <ExternalLink size={8} strokeWidth={2.5} />
            {SOURCE_LABELS[content.source_type]}
          </span>
        </div>

        {/* ジャンル（左下） + 枚数（右下） */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/85">
            {content.genre.name}
          </span>
          {content.images.length > 1 && (
            <span className="flex items-center gap-1 text-[10px] text-white/60">
              <Images size={9} strokeWidth={1.5} />
              {content.images.length}
            </span>
          )}
        </div>

        {/* ブックマークボタン */}
        <div
          className="absolute top-2.5 right-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkButton
            contentId={content.id}
            initialIsBookmarked={content.is_bookmarked}
          />
        </div>
      </div>

      {/* ── テキストエリア ── */}
      <div className="px-4 pt-3.5 pb-4">
        <h3 className="text-[13px] font-medium leading-[1.7] text-[#191916] line-clamp-2 mb-2">
          {content.title}
        </h3>

        {/* リンクタイプバッジ */}
        {uniqueLinkTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {uniqueLinkTypes.map((type) => (
              <span
                key={type}
                className={`inline-block text-[9px] font-medium tracking-[0.04em] px-1.5 py-0.5 rounded border ${LINK_COLORS[type]}`}
              >
                {LINK_LABELS[type]}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {content.location_name ? (
            <div className="flex items-center gap-1 text-[11px] text-[#A09890] min-w-0">
              <MapPin size={10} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="truncate">
                {content.location_name}
                {content.prefecture && (
                  <span className="text-[#C4BDB5]"> · {content.prefecture}</span>
                )}
              </span>
            </div>
          ) : (
            <span />
          )}
          <span className="flex-shrink-0 text-[11px] text-[#C4BDB5] tracking-[0.05em]">
            {content.bookmark_count.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
