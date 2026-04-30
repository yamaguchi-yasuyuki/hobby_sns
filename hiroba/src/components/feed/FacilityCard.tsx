import Image from "next/image"
import { MapPin, Ticket } from "lucide-react"
import BookmarkButton from "@/components/facility/BookmarkButton"
import type { Facility } from "@/types"

type FacilityCardProps = {
  facility: Facility
  onClick?: () => void
}

const OPERATOR_COLORS: Record<Facility["operator_type"], string> = {
  city:       "bg-[#1E7A4A]/90 text-white",
  town:       "bg-[#2E8A5A]/90 text-white",
  village:    "bg-[#6A5AAA]/90 text-white",
  ward:       "bg-[#AA5A2A]/90 text-white",
  prefecture: "bg-[#1A6A8A]/90 text-white",
  national:   "bg-[#145C38]/90 text-white",
}

const OPERATOR_LABELS: Record<Facility["operator_type"], string> = {
  city:       "市営",
  town:       "町営",
  village:    "村営",
  ward:       "区営",
  prefecture: "県営",
  national:   "国営",
}

export default function FacilityCard({ facility, onClick }: FacilityCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className="group block bg-white overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl hover:shadow-lg hover:-translate-y-0.5"
      style={{ border: "2px solid #C8DDD0", boxShadow: "0 2px 8px rgba(30,122,74,0.06)" }}
    >
      {/* ── 写真エリア ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8F5ED] rounded-t-2xl">
        <Image
          src={facility.image_url}
          alt={facility.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

        {/* 運営主体バッジ（左上） */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center text-[10px] font-bold tracking-[0.08em] px-2.5 py-1 rounded-full backdrop-blur-sm ${OPERATOR_COLORS[facility.operator_type]}`}
          >
            {OPERATOR_LABELS[facility.operator_type]}
          </span>
        </div>

        {/* カテゴリ（左下） */}
        <div className="absolute bottom-3 left-3 right-12">
          <span className="text-[11px] font-bold tracking-[0.12em] text-white drop-shadow">
            {facility.category.name}
          </span>
        </div>

        {/* ブックマークボタン */}
        <div
          className="absolute top-2.5 right-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkButton
            facilityId={facility.id}
            initialIsBookmarked={facility.is_bookmarked}
          />
        </div>
      </div>

      {/* ── テキストエリア ── */}
      <div className="px-4 pt-4 pb-4">
        <h3 className="text-[14px] font-bold leading-[1.65] text-[#1E3A2F] line-clamp-2 mb-3">
          {facility.title}
        </h3>

        {/* 料金バッジ */}
        {facility.admission_fee && (
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#FEF0E7", color: "#D46A10", border: "1.5px solid #F5C89A" }}
            >
              <Ticket size={11} strokeWidth={2.5} />
              {facility.admission_fee}
            </span>
          </div>
        )}

        {/* 場所・ブックマーク数 */}
        <div className="flex items-center justify-between gap-2">
          {facility.location_name ? (
            <div className="flex items-center gap-1.5 text-[12px] text-[#4A7060] min-w-0">
              <MapPin size={12} strokeWidth={2} className="flex-shrink-0 text-[#1E7A4A]" />
              <span className="truncate font-medium">
                {facility.location_name}
                {facility.prefecture && (
                  <span className="text-[#88A898]"> · {facility.prefecture}</span>
                )}
              </span>
            </div>
          ) : (
            <span />
          )}
          <div className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[#88A898]">
            <span>♡</span>
            <span>{facility.bookmark_count.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
