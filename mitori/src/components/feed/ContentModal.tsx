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
  ShoppingCart,
  Globe,
  FileText,
  CirclePlay,
} from "lucide-react"
import BookmarkButton from "@/components/content/BookmarkButton"
import type { Content, ContentLink } from "@/types"

type ContentModalProps = {
  contents: Content[]
  initialIndex: number
  onClose: () => void
}

const sourceLabels: Record<string, string> = {
  note:      "note",
  x:         "X / Twitter",
  youtube:   "YouTube",
  instagram: "Instagram",
  blog:      "ブログ",
  other:     "Web",
}

const BODY_PREVIEW_LENGTH = 180

function trackUrl(contentId: string, linkIndex: number, url: string): string {
  return `/api/track?cid=${encodeURIComponent(contentId)}&idx=${linkIndex}&to=${encodeURIComponent(url)}`
}

function LinkIcon({ type }: { type: ContentLink["type"] }) {
  const cls = "shrink-0"
  if (type === "amazon")  return <ShoppingCart size={13} strokeWidth={1.5} className={cls} />
  if (type === "shop")    return <ShoppingCart size={13} strokeWidth={1.5} className={cls} />
  if (type === "youtube") return <CirclePlay    size={13} strokeWidth={1.5} className={cls} />
  if (type === "note")    return <FileText     size={13} strokeWidth={1.5} className={cls} />
  return                         <Globe        size={13} strokeWidth={1.5} className={cls} />
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

export default function ContentModal({
  contents,
  initialIndex,
  onClose,
}: ContentModalProps) {
  const [contentIndex, setContentIndex] = useState(initialIndex)
  const [photoIndex,   setPhotoIndex]   = useState(0)
  const [animKey,      setAnimKey]      = useState(0)
  const [slideDir,     setSlideDir]     = useState<"left" | "right">("left")
  const [bodyExpanded, setBodyExpanded] = useState(false)

  const content    = contents[contentIndex]
  const photos     = content.images
  const totalPhotos = photos.length

  const changePhoto = useCallback((next: number, dir: "left" | "right") => {
    setSlideDir(dir); setPhotoIndex(next); setAnimKey((k) => k + 1)
  }, [])

  const changeContent = useCallback(
    (next: number, dir: "left" | "right", photo = 0) => {
      setSlideDir(dir)
      setContentIndex(next)
      setPhotoIndex(photo)
      setAnimKey((k) => k + 1)
      setBodyExpanded(false)
    },
    []
  )

  const photoSwipeLeft = useCallback(() => {
    if (photoIndex < totalPhotos - 1)          changePhoto(photoIndex + 1, "left")
    else if (contentIndex < contents.length - 1) changeContent(contentIndex + 1, "left", 0)
  }, [photoIndex, totalPhotos, contentIndex, contents.length, changePhoto, changeContent])

  const photoSwipeRight = useCallback(() => {
    if (photoIndex > 0)        changePhoto(photoIndex - 1, "right")
    else if (contentIndex > 0) changeContent(contentIndex - 1, "right", contents[contentIndex - 1].images.length - 1)
  }, [photoIndex, contentIndex, contents, changePhoto, changeContent])

  const infoSwipeLeft  = useCallback(() => {
    if (contentIndex < contents.length - 1) changeContent(contentIndex + 1, "left", 0)
  }, [contentIndex, contents.length, changeContent])
  const infoSwipeRight = useCallback(() => {
    if (contentIndex > 0) changeContent(contentIndex - 1, "right", 0)
  }, [contentIndex, changeContent])

  const photoSwipe = useSwipe(photoSwipeLeft, photoSwipeRight)
  const infoSwipe  = useSwipe(infoSwipeLeft,  infoSwipeRight)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose()
      if (e.key === "ArrowRight")  photoSwipeLeft()
      if (e.key === "ArrowLeft")   photoSwipeRight()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose, photoSwipeLeft, photoSwipeRight])

  const hasPrevPhoto   = photoIndex   > 0
  const hasNextPhoto   = photoIndex   < totalPhotos - 1
  const hasPrevContent = contentIndex > 0
  const hasNextContent = contentIndex < contents.length - 1

  const body = content.body ?? ""
  const hasLongBody = body.length > BODY_PREVIEW_LENGTH
  const displayBody = hasLongBody && !bodyExpanded
    ? body.slice(0, BODY_PREVIEW_LENGTH) + "…"
    : body

  const links = content.links ?? []
  const hasFallbackLink = links.length === 0

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-backdrop-in"
      style={{ backgroundColor: "rgba(15,14,12,0.88)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      <div
        className="relative w-full sm:max-w-lg sm:mx-4 bg-[#FDFCFA] overflow-hidden flex flex-col animate-modal-in"
        style={{ maxHeight: "92dvh", borderTop: "3px solid #1E3028" }}
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
          className="relative aspect-video flex-shrink-0 overflow-hidden select-none bg-[#191916]"
          {...photoSwipe}
        >
          <div
            key={animKey}
            className={slideDir === "left" ? "animate-slide-right" : "animate-slide-left"}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={photos[photoIndex]}
              alt={`${content.title} — 写真${photoIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, 512px"
              draggable={false}
              unoptimized
            />
          </div>

          {/* 上部：ジャンル（左）+ カウンター（右） */}
          <div className="absolute top-0 left-0 right-0 px-4 pt-3.5 flex items-start justify-between z-10"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }}>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/80">
              {content.genre.name}
            </span>
            <div className="flex items-center gap-2 mr-7">
              {totalPhotos > 1 && (
                <span className="flex items-center gap-1 text-[10px] text-white/60">
                  <Images size={9} strokeWidth={1.5} />
                  {photoIndex + 1}/{totalPhotos}
                </span>
              )}
              <span className="text-[10px] text-white/40">
                {contentIndex + 1}/{contents.length}
              </span>
            </div>
          </div>

          {(hasPrevPhoto || hasPrevContent) && (
            <button
              onClick={(e) => { e.stopPropagation(); photoSwipeRight() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
              aria-label={hasPrevPhoto ? "前の写真" : "前のコンテンツ"}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
          )}
          {(hasNextPhoto || hasNextContent) && (
            <button
              onClick={(e) => { e.stopPropagation(); photoSwipeLeft() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
              aria-label={hasNextPhoto ? "次の写真" : "次のコンテンツ"}
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

            {/* コンテンツナビ */}
            {(hasPrevContent || hasNextContent) && (
              <div className="flex items-center justify-between mb-4"
                style={{ paddingBottom: "14px", borderBottom: "1px solid #EEEAE4" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); infoSwipeRight() }}
                  disabled={!hasPrevContent}
                  className="flex items-center gap-1 text-[11px] tracking-[0.05em] text-[#A09890] disabled:opacity-20 hover:text-[#191916] transition-colors duration-200"
                >
                  <ChevronLeft size={12} strokeWidth={1.5} />
                  前へ
                </button>
                <span className="text-[10px] text-[#C4BDB5] tracking-[0.1em]">
                  {contentIndex + 1} / {contents.length}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); infoSwipeLeft() }}
                  disabled={!hasNextContent}
                  className="flex items-center gap-1 text-[11px] tracking-[0.05em] text-[#A09890] disabled:opacity-20 hover:text-[#191916] transition-colors duration-200"
                >
                  次へ
                  <ChevronRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* タイトル */}
            <h2 className="font-serif text-[18px] font-light leading-[1.6] text-[#191916] mb-3">
              {content.title}
            </h2>

            {/* メタデータ */}
            {content.location_name && (
              <div className="flex items-center gap-1.5 text-[11px] tracking-[0.08em] text-[#A09890] mb-4">
                <MapPin size={11} strokeWidth={1.5} />
                <span>
                  {content.location_name}
                  {content.prefecture && (
                    <span className="text-[#C4BDB5]"> · {content.prefecture}</span>
                  )}
                </span>
              </div>
            )}

            {/* ━━━ リンク一覧（タイトル直下） ━━━ */}
            <div className="flex flex-col gap-2 mb-5">
              {links.length > 0 ? (
                links.map((link, idx) => (
                  <a
                    key={idx}
                    href={trackUrl(content.id, idx, link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between gap-3 py-3 px-4 text-[12px] tracking-[0.06em] text-[#FDFCFA] transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
                    style={{
                      background: idx === 0 ? "#1E3028" : "#3D5A4C",
                      borderRadius: "4px",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <LinkIcon type={link.type} />
                      {link.label}
                    </span>
                    <ArrowRight size={12} strokeWidth={1.5} className="shrink-0 opacity-60" />
                  </a>
                ))
              ) : hasFallbackLink && (
                <a
                  href={trackUrl(content.id, 0, content.external_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 py-3 px-5 text-[12px] tracking-[0.12em] font-medium text-[#FDFCFA] transition-all duration-300 hover:opacity-80"
                  style={{ background: "#1E3028" }}
                >
                  <span>{sourceLabels[content.source_type] ?? "Web"}で読む</span>
                  <ArrowRight size={13} strokeWidth={1.5} />
                </a>
              )}
            </div>

            {/* 区切り線 */}
            <div style={{ height: "1px", background: "#EEEAE4", marginBottom: "16px" }} />

            {/* 説明文 */}
            <p className="text-[13px] leading-[1.85] text-[#605A52] mb-4">
              {content.description}
            </p>

            {/* ━━━ 詳細本文（折りたたみ） ━━━ */}
            {body && (
              <div className="mb-5" style={{ borderTop: "1px dashed #DDD8CF", paddingTop: "14px" }}>
                <p
                  className="text-[12.5px] leading-[1.9] text-[#605A52] whitespace-pre-line"
                  style={{ transition: "all 0.3s ease" }}
                >
                  {displayBody}
                </p>
                {hasLongBody && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setBodyExpanded((v) => !v) }}
                    className="flex items-center gap-1 mt-3 text-[11px] tracking-[0.1em] text-[#1E3028] hover:opacity-70 transition-opacity"
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
              style={{ borderTop: "1px solid #EEEAE4" }}
              onClick={(e) => e.stopPropagation()}
            >
              <BookmarkButton
                contentId={content.id}
                initialIsBookmarked={content.is_bookmarked}
              />
              <span className="text-[11px] tracking-[0.05em] text-[#A09890]">
                {content.bookmark_count.toLocaleString()} 人が保存
              </span>
              <div className="flex-1" />
              <a
                href={trackUrl(content.id, 99, content.external_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-[#A09890] hover:text-[#191916] transition-colors duration-200"
                style={{ border: "1px solid #DDD8CF" }}
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
