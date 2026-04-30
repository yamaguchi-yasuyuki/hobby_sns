"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { use, useState } from "react"
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShoppingCart,
  Globe,
  FileText,
  CirclePlay,
} from "lucide-react"
import BookmarkButton from "@/components/content/BookmarkButton"
import { mockContents } from "@/lib/mock-data"
import type { ContentLink } from "@/types"

type ContentDetailPageProps = {
  params: Promise<{ id: string }>
}

const sourceLabels: Record<string, string> = {
  note: "note",
  x: "X（Twitter）",
  youtube: "YouTube",
  instagram: "Instagram",
  blog: "ブログ",
  other: "Web",
}

const BODY_PREVIEW_LENGTH = 300

function trackUrl(contentId: string, linkIndex: number, url: string): string {
  return `/api/track?cid=${encodeURIComponent(contentId)}&idx=${linkIndex}&to=${encodeURIComponent(url)}`
}

function LinkIcon({ type }: { type: ContentLink["type"] }) {
  if (type === "amazon" || type === "shop") return <ShoppingCart size={16} strokeWidth={1.5} className="shrink-0" />
  if (type === "youtube") return <CirclePlay size={16} strokeWidth={1.5} className="shrink-0" />
  if (type === "note")    return <FileText size={16} strokeWidth={1.5} className="shrink-0" />
  return <Globe size={16} strokeWidth={1.5} className="shrink-0" />
}

export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { id } = use(params)
  const content = mockContents.find((c) => c.id === id)

  if (!content) notFound()

  const [bodyExpanded, setBodyExpanded] = useState(false)

  const body = content.body ?? ""
  const hasLongBody = body.length > BODY_PREVIEW_LENGTH
  const displayBody = hasLongBody && !bodyExpanded
    ? body.slice(0, BODY_PREVIEW_LENGTH) + "…"
    : body

  const links = content.links ?? []

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* 戻るボタン */}
      <div className="px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#2D4A3E] transition-colors"
        >
          <ArrowLeft size={16} />
          フィードに戻る
        </Link>
      </div>

      {/* 画像 */}
      <div className="relative w-full aspect-video bg-[#EFEDE9]">
        <Image
          src={content.image_url}
          alt={content.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          unoptimized
        />
      </div>

      {/* コンテンツ情報 */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* ジャンルタグ */}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#2D4A3E] text-white mb-3">
          {content.genre.name}
        </span>

        {/* タイトル */}
        <h1 className="text-xl font-bold text-[#2C2C2C] leading-snug mb-4">
          {content.title}
        </h1>

        {/* 場所・出典 */}
        <div className="flex flex-wrap gap-3 mb-4">
          {content.location_name && (
            <div className="flex items-center gap-1 text-sm text-[#6B6B6B]">
              <MapPin size={14} />
              <span>
                {content.location_name}
                {content.prefecture && ` / ${content.prefecture}`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-[#6B6B6B]">
            <ExternalLink size={14} />
            <span>出典：{sourceLabels[content.source_type] ?? "Web"}</span>
          </div>
        </div>

        {/* 人数表示 */}
        <div className="flex items-center gap-1.5 text-sm text-[#A0A0A0] mb-5">
          <Users size={14} />
          <span>{content.bookmark_count.toLocaleString()}人が気になっています</span>
        </div>

        {/* 区切り */}
        <div className="h-px bg-[#E2DED8] mb-5" />

        {/* 説明文 */}
        <p className="text-base text-[#2C2C2C] leading-relaxed mb-5">
          {content.description}
        </p>

        {/* ━━━ 詳細本文（折りたたみ） ━━━ */}
        {body && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-[#E2DED8]">
            <p className="text-[14px] leading-[2] text-[#3A3A3A] whitespace-pre-line">
              {displayBody}
            </p>
            {hasLongBody && (
              <button
                onClick={() => setBodyExpanded((v) => !v)}
                className="flex items-center gap-1.5 mt-4 text-sm font-medium text-[#2D4A3E] hover:opacity-70 transition-opacity"
              >
                {bodyExpanded ? (
                  <><ChevronUp size={14} strokeWidth={2} />折りたたむ</>
                ) : (
                  <><ChevronDown size={14} strokeWidth={2} />続きを読む（全文表示）</>
                )}
              </button>
            )}
          </div>
        )}

        {/* ━━━ リンク一覧 ━━━ */}
        <div className="flex flex-col gap-3 mb-6">
          {links.length > 0 ? (
            links.map((link, idx) => (
              <a
                key={idx}
                href={trackUrl(content.id, idx, link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 w-full py-3.5 px-5 rounded-xl font-medium text-sm transition-all hover:opacity-85 active:scale-[0.99]"
                style={{
                  background: idx === 0 ? "#2D4A3E" : "#F0EDE8",
                  color: idx === 0 ? "#FFFFFF" : "#2C2C2C",
                  border: idx === 0 ? "none" : "1px solid #DDD8CF",
                }}
              >
                <span className="flex items-center gap-2.5">
                  <LinkIcon type={link.type} />
                  {link.label}
                </span>
                <ArrowRight size={15} strokeWidth={1.5} className="shrink-0 opacity-60" />
              </a>
            ))
          ) : (
            <a
              href={trackUrl(content.id, 0, content.external_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl border-2 border-[#2D4A3E] text-[#2D4A3E] font-medium hover:bg-[#2D4A3E] hover:text-white transition-all"
            >
              <ExternalLink size={18} />
              記事を読む（{sourceLabels[content.source_type] ?? "Web"}）
            </a>
          )}
        </div>

        {/* ブックマーク */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#E2DED8]">
          <BookmarkButton
            contentId={content.id}
            initialIsBookmarked={content.is_bookmarked}
            className="flex-shrink-0"
          />
          <span className="text-sm text-[#6B6B6B]">
            {content.is_bookmarked
              ? "コレクションに保存済み"
              : "コレクションに保存する"}
          </span>
        </div>
      </div>
    </div>
  )
}
