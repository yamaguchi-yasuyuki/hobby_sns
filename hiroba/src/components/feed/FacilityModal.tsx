"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ExternalLink,
  Images,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe,
  Navigation,
  CalendarCheck,
  Coins,
  Clock,
  Building2,
} from "lucide-react"
import BookmarkButton from "@/components/facility/BookmarkButton"
import type { Facility, FacilityLink } from "@/types"

type FacilityModalProps = {
  facilities: Facility[]
  initialIndex: number
  onClose: () => void
}

const OPERATOR_LABELS: Record<Facility["operator_type"], string> = {
  city:       "市区運営",
  town:       "町営",
  village:    "村営",
  ward:       "区営",
  prefecture: "都道府県営",
  national:   "国営",
}

const BODY_PREVIEW_LENGTH = 200

function trackUrl(facilityId: string, linkIndex: number, url: string): string {
  return `/api/track?cid=${encodeURIComponent(facilityId)}&idx=${linkIndex}&to=${encodeURIComponent(url)}`
}

function LinkIcon({ type }: { type: FacilityLink["type"] }) {
  const cls = "shrink-0"
  if (type === "map")         return <Navigation   size={13} strokeWidth={1.5} className={cls} />
  if (type === "reservation") return <CalendarCheck size={13} strokeWidth={1.5} className={cls} />
  if (type === "official")    return <Building2     size={13} strokeWidth={1.5} className={cls} />
  return                             <Globe         size={13} strokeWidth={1.5} className={cls} />
}

function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50
) {
  const startX = useRef(0)
  const startY = useRef(0)
  const isHorizontal = useRef(false)

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.targetTouches[0].clientX
    startY.current = e.targetTouches[0].clientY
    isHorizontal.current = false
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(startX.current - e.targetTouches[0].clientX)
    const dy = Math.abs(startY.current - e.targetTouches[0].clientY)
    if (dx > dy && dx > 10) isHorizontal.current = true
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isHorizontal.current) return
    const diff = startX.current - e.changedTouches[0].clientX
    const dy   = Math.abs(startY.current - e.changedTouches[0].clientY)
    if (Math.abs(diff) > threshold && Math.abs(diff) > dy) {
      diff > 0 ? onSwipeLeft() : onSwipeRight()
    }
    isHorizontal.current = false
  }
  return { onTouchStart, onTouchMove, onTouchEnd }
}

export default function FacilityModal({
  facilities,
  initialIndex,
  onClose,
}: FacilityModalProps) {
  const [facilityIndex, setFacilityIndex] = useState(initialIndex)
  const [photoIndex,    setPhotoIndex]    = useState(0)
  const [animKey,       setAnimKey]       = useState(0)
  const [slideDir,      setSlideDir]      = useState<"left" | "right">("left")
  const [bodyExpanded,  setBodyExpanded]  = useState(false)

  const facility   = facilities[facilityIndex]
  const photos     = facility.images
  const totalPhotos = photos.length

  const changePhoto = useCallback((next: number, dir: "left" | "right") => {
    setSlideDir(dir); setPhotoIndex(next); setAnimKey((k) => k + 1)
  }, [])

  const changeFacility = useCallback(
    (next: number, dir: "left" | "right", photo = 0) => {
      setSlideDir(dir)
      setFacilityIndex(next)
      setPhotoIndex(photo)
      setAnimKey((k) => k + 1)
      setBodyExpanded(false)
    },
    []
  )

  const photoSwipeLeft = useCallback(() => {
    if (photoIndex < totalPhotos - 1)             changePhoto(photoIndex + 1, "left")
    else if (facilityIndex < facilities.length - 1) changeFacility(facilityIndex + 1, "left", 0)
  }, [photoIndex, totalPhotos, facilityIndex, facilities.length, changePhoto, changeFacility])

  const photoSwipeRight = useCallback(() => {
    if (photoIndex > 0)          changePhoto(photoIndex - 1, "right")
    else if (facilityIndex > 0)  changeFacility(facilityIndex - 1, "right", facilities[facilityIndex - 1].images.length - 1)
  }, [photoIndex, facilityIndex, facilities, changePhoto, changeFacility])

  const infoSwipeLeft  = useCallback(() => {
    if (facilityIndex < facilities.length - 1) changeFacility(facilityIndex + 1, "left", 0)
  }, [facilityIndex, facilities.length, changeFacility])
  const infoSwipeRight = useCallback(() => {
    if (facilityIndex > 0) changeFacility(facilityIndex - 1, "right", 0)
  }, [facilityIndex, changeFacility])

  const photoSwipe = useSwipe(photoSwipeLeft, photoSwipeRight)
  const infoSwipe  = useSwipe(infoSwipeLeft,  infoSwipeRight)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowRight") photoSwipeLeft()
      if (e.key === "ArrowLeft")  photoSwipeRight()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose, photoSwipeLeft, photoSwipeRight])

  const hasPrevPhoto    = photoIndex    > 0
  const hasNextPhoto    = photoIndex    < totalPhotos - 1
  const hasPrevFacility = facilityIndex > 0
  const hasNextFacility = facilityIndex < facilities.length - 1

  const body = facility.body ?? ""
  const hasLongBody = body.length > BODY_PREVIEW_LENGTH
  const displayBody = hasLongBody && !bodyExpanded
    ? body.slice(0, BODY_PREVIEW_LENGTH) + "…"
    : body

  const links = facility.links ?? []

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-backdrop-in"
      style={{ backgroundColor: "rgba(10,20,35,0.88)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={facility.title}
    >
      <div
        className="relative w-full sm:max-w-lg sm:mx-4 bg-white overflow-hidden flex flex-col animate-modal-in rounded-t-3xl sm:rounded-3xl"
        style={{ maxHeight: "92dvh", borderTop: "4px solid #1E7A4A" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 text-white/70 hover:text-white transition-colors duration-200"
          aria-label="閉じる"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* ━━━ 写真エリア ━━━ */}
        <div
          className="relative aspect-video flex-shrink-0 overflow-hidden select-none bg-[#0F2B4A]"
          {...photoSwipe}
        >
          <div
            key={animKey}
            className={slideDir === "left" ? "animate-slide-right" : "animate-slide-left"}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={photos[photoIndex]}
              alt={`${facility.title} — 写真${photoIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, 512px"
              draggable={false}
              unoptimized
            />
          </div>

          {/* 上部：カテゴリ（左）+ カウンター（右） */}
          <div className="absolute top-0 left-0 right-0 px-4 pt-3.5 flex items-start justify-between z-10"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)" }}>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/80">
              {facility.category.name}
            </span>
            <div className="flex items-center gap-2 mr-7">
              {totalPhotos > 1 && (
                <span className="flex items-center gap-1 text-[10px] text-white/60">
                  <Images size={9} strokeWidth={1.5} />
                  {photoIndex + 1}/{totalPhotos}
                </span>
              )}
              <span className="text-[10px] text-white/40">
                {facilityIndex + 1}/{facilities.length}
              </span>
            </div>
          </div>

          {(hasPrevPhoto || hasPrevFacility) && (
            <button
              onClick={(e) => { e.stopPropagation(); photoSwipeRight() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
              aria-label={hasPrevPhoto ? "前の写真" : "前の施設"}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
          )}
          {(hasNextPhoto || hasNextFacility) && (
            <button
              onClick={(e) => { e.stopPropagation(); photoSwipeLeft() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
              aria-label={hasNextPhoto ? "次の写真" : "次の施設"}
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          )}

          {totalPhotos > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 items-center">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); changePhoto(i, i > photoIndex ? "left" : "right") }}
                  className={`rounded-full transition-all duration-300 ${
                    i === photoIndex ? "w-4 h-1 bg-white" : "w-1 h-1 bg-white/35 hover:bg-white/60"
                  }`}
                  aria-label={`写真${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ━━━ 情報エリア ━━━ */}
        <div className="overflow-y-auto flex-1 select-none" {...infoSwipe}>
          <div className="px-6 pt-5 pb-6">

            {/* 施設ナビ */}
            {(hasPrevFacility || hasNextFacility) && (
              <div className="flex items-center justify-between mb-4"
                style={{ paddingBottom: "14px", borderBottom: "1px solid #E5EEF5" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); infoSwipeRight() }}
                  disabled={!hasPrevFacility}
                  className="flex items-center gap-1 text-[11px] tracking-[0.05em] text-[#8AA0B4] disabled:opacity-20 hover:text-[#1A2538] transition-colors duration-200"
                >
                  <ChevronLeft size={12} strokeWidth={1.5} />
                  前へ
                </button>
                <span className="text-[10px] text-[#B0C4D4] tracking-[0.1em]">
                  {facilityIndex + 1} / {facilities.length}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); infoSwipeLeft() }}
                  disabled={!hasNextFacility}
                  className="flex items-center gap-1 text-[11px] tracking-[0.05em] text-[#8AA0B4] disabled:opacity-20 hover:text-[#1A2538] transition-colors duration-200"
                >
                  次へ
                  <ChevronRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* タイトル */}
            <h2 className="text-[18px] font-extrabold leading-[1.5] text-[#1E3A2F] mb-2">
              {facility.title}
            </h2>

            {/* メタデータ行 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
              {/* 運営主体 */}
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.06em] px-2.5 py-1 rounded-full"
                style={{ background: "#E8F5ED", color: "#1E7A4A", border: "1.5px solid #C8DDD0" }}
              >
                <Building2 size={9} strokeWidth={1.5} />
                {facility.operator}（{OPERATOR_LABELS[facility.operator_type]}）
              </span>

              {/* 場所 */}
              {facility.location_name && (
                <span className="flex items-center gap-1 text-[11px] tracking-[0.08em] text-[#8AA0B4]">
                  <MapPin size={10} strokeWidth={1.5} />
                  {facility.location_name}
                  {facility.prefecture && (
                    <span className="text-[#B0C4D4]"> · {facility.prefecture}</span>
                  )}
                </span>
              )}
            </div>

            {/* 料金・営業時間 */}
            {(facility.admission_fee || facility.opening_hours) && (
              <div className="flex flex-wrap gap-3 mb-4 p-3.5 rounded-xl"
                style={{ background: "#FEF0E7", border: "1.5px solid #F5C89A" }}>
                {facility.admission_fee && (
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#D46A10]">
                    <Coins size={13} strokeWidth={2.5} />
                    {facility.admission_fee}
                  </span>
                )}
                {facility.opening_hours && (
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#D46A10]">
                    <Clock size={13} strokeWidth={2.5} />
                    {facility.opening_hours}
                  </span>
                )}
              </div>
            )}

            {/* リンク一覧 */}
            {links.length > 0 && (
              <div className="flex flex-col gap-2 mb-5">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={trackUrl(facility.id, idx, link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between gap-3 py-3.5 px-4 text-[13px] font-bold text-white transition-all duration-200 hover:opacity-85 active:scale-[0.98] rounded-xl"
                    style={{
                      background: idx === 0 ? "#1E7A4A" : "#2E9A60",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <LinkIcon type={link.type} />
                      {link.label}
                    </span>
                    <ArrowRight size={12} strokeWidth={1.5} className="shrink-0 opacity-60" />
                  </a>
                ))}
              </div>
            )}

            {links.length === 0 && (
              <div className="mb-5">
                <a
                  href={trackUrl(facility.id, 0, facility.official_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 py-3.5 px-5 text-[13px] font-bold text-white transition-all duration-300 hover:opacity-80 rounded-xl"
                  style={{ background: "#1E7A4A" }}
                >
                  <Globe size={13} strokeWidth={1.5} />
                  <span>公式サイトで確認する</span>
                  <ArrowRight size={13} strokeWidth={1.5} />
                </a>
              </div>
            )}

            {/* 区切り線 */}
            <div style={{ height: "1px", background: "#E0EEE6", marginBottom: "16px" }} />

            {/* 説明文 */}
            <p className="text-[13px] leading-[1.85] text-[#4A7060] mb-4">
              {facility.description}
            </p>

            {/* 詳細本文（折りたたみ） */}
            {body && (
              <div className="mb-5" style={{ borderTop: "1px dashed #D1DCE8", paddingTop: "14px" }}>
                <p
                  className="text-[12.5px] leading-[1.9] text-[#4A6070] whitespace-pre-line"
                  style={{ transition: "all 0.3s ease" }}
                >
                  {displayBody}
                </p>
                {hasLongBody && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setBodyExpanded((v) => !v) }}
                    className="flex items-center gap-1 mt-3 text-[11px] tracking-[0.1em] text-[#1A4B7A] hover:opacity-70 transition-opacity"
                  >
                    {bodyExpanded ? (
                      <><ChevronUp size={12} strokeWidth={1.5} />折りたたむ</>
                    ) : (
                      <><ChevronDown size={12} strokeWidth={1.5} />続きを読む</>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* ━━━ ブックマーク ━━━ */}
            <div
              className="flex items-center gap-2 pt-4"
              style={{ borderTop: "1px solid #E5EEF5" }}
              onClick={(e) => e.stopPropagation()}
            >
              <BookmarkButton
                facilityId={facility.id}
                initialIsBookmarked={facility.is_bookmarked}
              />
              <span className="text-[11px] tracking-[0.05em] text-[#8AA0B4]">
                {facility.bookmark_count.toLocaleString()} 人が保存
              </span>
              <div className="flex-1" />
              <a
                href={trackUrl(facility.id, 99, facility.official_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl text-[#88A898] hover:text-[#1E3A2F] transition-colors duration-200"
                  style={{ border: "2px solid #C8DDD0" }}
                aria-label="新しいタブで開く"
              >
                <ExternalLink size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
