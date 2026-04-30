"use client"

import { useState } from "react"
import Image from "next/image"
import { Link2, Upload, Save, Plus, Trash2, GripVertical } from "lucide-react"
import { mockGenres } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { LinkType } from "@/types"

const sourceTypes = [
  { value: "note", label: "note" },
  { value: "x", label: "X（Twitter）" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "blog", label: "ブログ" },
  { value: "other", label: "その他" },
]

const linkTypes: { value: LinkType; label: string }[] = [
  { value: "note",    label: "note" },
  { value: "website", label: "公式サイト" },
  { value: "youtube", label: "YouTube" },
  { value: "amazon",  label: "Amazon" },
  { value: "shop",    label: "ショップ" },
  { value: "other",   label: "その他" },
]

const statusOptions = [
  { value: "draft",       label: "下書き" },
  { value: "published",   label: "公開" },
  { value: "unpublished", label: "非公開" },
]

type LinkRow = { label: string; url: string; type: LinkType }

const emptyLink = (): LinkRow => ({ label: "", url: "", type: "website" })

export default function AdminContentNewPage() {
  const [url, setUrl] = useState("")
  const [isScraping, setIsScraping] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    body: "",
    image_url: "",
    external_url: "",
    source_type: "note",
    genre_id: "",
    location_name: "",
    prefecture: "",
    status: "draft",
  })
  const [links, setLinks] = useState<LinkRow[]>([emptyLink()])

  const handleScrape = async () => {
    if (!url) return
    setIsScraping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setForm((prev) => ({
      ...prev,
      title: "スクレイピングで取得したタイトル（モック）",
      description: "OGPから取得した説明文がここに入ります。",
      image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      external_url: url,
      source_type: url.includes("note.com") ? "note" : url.includes("youtube") ? "youtube" : "other",
    }))
    setLinks([{ label: "記事を読む", url, type: url.includes("note.com") ? "note" : "website" }])
    setIsScraping(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, links: links.filter((l) => l.label && l.url) }
    alert("保存しました（モック）\n" + JSON.stringify(payload, null, 2))
  }

  const updateLink = (idx: number, field: keyof LinkRow, value: string) => {
    setLinks((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }
  const addLink    = () => setLinks((prev) => [...prev, emptyLink()])
  const removeLink = (idx: number) => setLinks((prev) => prev.filter((_, i) => i !== idx))

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-[#E2DED8] bg-white text-sm text-[#2C2C2C] focus:outline-none focus:border-[#2D4A3E] transition-colors"
  const bodyLen = form.body.length

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-[#2C2C2C] mb-6">コンテンツ登録</h1>

      {/* OGPスクレイピング */}
      <div className="bg-white rounded-xl border border-[#E2DED8] p-4 mb-6">
        <h2 className="text-sm font-semibold text-[#2C2C2C] mb-3 flex items-center gap-2">
          <Link2 size={15} className="text-[#2D4A3E]" />
          URLから自動取得
        </h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://note.com/..."
            className={cn(inputClass, "flex-1")}
          />
          <button
            type="button"
            onClick={handleScrape}
            disabled={!url || isScraping}
            className="px-4 py-2.5 rounded-lg bg-[#2D4A3E] text-white text-sm font-medium disabled:opacity-50 hover:bg-[#243d33] transition-colors flex-shrink-0"
          >
            {isScraping ? "取得中..." : "取得"}
          </button>
        </div>
        <p className="text-xs text-[#A0A0A0] mt-2">
          取得できない場合は下のフォームに手動で入力してください
        </p>
      </div>

      {/* 登録フォーム */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* 基本情報 */}
        <div className="bg-white rounded-xl border border-[#E2DED8] p-4 space-y-4">
          <h2 className="text-sm font-semibold text-[#2C2C2C] flex items-center gap-2">
            <Upload size={15} className="text-[#2D4A3E]" />
            基本情報
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="コンテンツのタイトル"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
              カード説明文
              <span className="text-[#A0A0A0] font-normal ml-1">（一覧カードに表示される短い説明）</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="コンテンツの概要（100〜150文字程度）"
              rows={3}
              className={cn(inputClass, "resize-none")}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#6B6B6B]">
                詳細本文
                <span className="text-[#A0A0A0] font-normal ml-1">（詳細画面に表示・最大2000文字）</span>
              </label>
              <span className={cn(
                "text-xs",
                bodyLen > 2000 ? "text-red-500 font-medium" : "text-[#A0A0A0]"
              )}>
                {bodyLen.toLocaleString()} / 2,000
              </span>
            </div>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder={`アクセス方法、おすすめポイント、体験レポートなど詳しく書けます。\n\n【見出し】\n内容...`}
              rows={10}
              maxLength={2000}
              className={cn(inputClass, "resize-y font-mono text-xs leading-relaxed")}
            />
            <p className="text-[11px] text-[#A0A0A0] mt-1">
              180文字を超えると詳細画面で「続きを読む」ボタンが表示されます
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                画像URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className={inputClass}
                required
              />
            </div>
            {form.image_url && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#EFEDE9]">
                <Image src={form.image_url} alt="プレビュー" fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                出典元 <span className="text-red-500">*</span>
              </label>
              <select
                value={form.source_type}
                onChange={(e) => setForm({ ...form, source_type: e.target.value })}
                className={inputClass}
              >
                {sourceTypes.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                ジャンル <span className="text-red-500">*</span>
              </label>
              <select
                value={form.genre_id}
                onChange={(e) => setForm({ ...form, genre_id: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">選択...</option>
                {mockGenres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                ステータス <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">場所名</label>
              <input
                type="text"
                value={form.location_name}
                onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                placeholder="奥入瀬渓流"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">都道府県</label>
              <input
                type="text"
                value={form.prefecture}
                onChange={(e) => setForm({ ...form, prefecture: e.target.value })}
                placeholder="青森県"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* リンク設定 */}
        <div className="bg-white rounded-xl border border-[#E2DED8] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#2C2C2C] flex items-center gap-2">
              <Link2 size={15} className="text-[#2D4A3E]" />
              リンク設定
              <span className="text-xs text-[#A0A0A0] font-normal">（クリック数が自動計測されます）</span>
            </h2>
            <button
              type="button"
              onClick={addLink}
              disabled={links.length >= 5}
              className="flex items-center gap-1 text-xs text-[#2D4A3E] hover:opacity-70 transition-opacity disabled:opacity-30"
            >
              <Plus size={13} strokeWidth={2} />
              追加
            </button>
          </div>

          <div className="space-y-3">
            {links.map((link, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{ background: "#F7F5F2" }}
              >
                <GripVertical size={16} className="text-[#C4BDB5] mt-2.5 shrink-0 cursor-grab" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={link.type}
                      onChange={(e) => updateLink(idx, "type", e.target.value)}
                      className={cn(inputClass, "w-32 flex-shrink-0 text-xs")}
                    >
                      {linkTypes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(idx, "label", e.target.value)}
                      placeholder='ボタンのラベル（例：「note記事を読む」）'
                      className={cn(inputClass, "flex-1 text-xs")}
                    />
                  </div>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(idx, "url", e.target.value)}
                    placeholder="https://..."
                    className={cn(inputClass, "text-xs")}
                  />
                </div>
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="p-1.5 text-[#C4BDB5] hover:text-red-400 transition-colors shrink-0 mt-1"
                    aria-label="削除"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#A0A0A0] mt-3">
            最大5件まで設定できます。先頭のリンクがメインボタンとして目立つ色で表示されます。
          </p>
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setForm({ title: "", description: "", body: "", image_url: "", external_url: "", source_type: "note", genre_id: "", location_name: "", prefecture: "", status: "draft" })
              setLinks([emptyLink()])
            }}
            className="px-4 py-2.5 rounded-lg border border-[#E2DED8] text-sm text-[#6B6B6B] hover:bg-[#F7F5F2] transition-colors"
          >
            クリア
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2D4A3E] text-white text-sm font-medium hover:bg-[#243d33] transition-colors"
          >
            <Save size={15} />
            保存する
          </button>
        </div>
      </form>
    </div>
  )
}
