"use client"

import { useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Facility, FacilityLink, FacilityStatus, LinkType, OperatorType } from "@/types"
import { mockCategories } from "@/lib/mock-data"

const LINK_TYPES: { value: LinkType; label: string }[] = [
  { value: "official", label: "公式" },
  { value: "website", label: "Web" },
  { value: "map", label: "地図" },
  { value: "reservation", label: "予約" },
  { value: "youtube", label: "動画" },
  { value: "other", label: "その他" },
]

const OPERATOR_TYPES: { value: OperatorType; label: string }[] = [
  { value: "city", label: "市営" },
  { value: "town", label: "町営" },
  { value: "village", label: "村営" },
  { value: "ward", label: "区営" },
  { value: "prefecture", label: "県営" },
  { value: "national", label: "国営" },
]

type Props = {
  mode: "new" | "edit"
  initialFacility?: Facility
}

function emptyLinkRow(): FacilityLink {
  return { label: "", url: "", type: "official" }
}

export default function FacilityStaffForm({ mode, initialFacility }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<FacilityStatus>(initialFacility?.status ?? "draft")
  const [title, setTitle] = useState(initialFacility?.title ?? "")
  const [description, setDescription] = useState(initialFacility?.description ?? "")
  const [body, setBody] = useState(initialFacility?.body ?? "")
  const [imageUrl, setImageUrl] = useState(initialFacility?.image_url ?? "")
  const [extraImageUrls, setExtraImageUrls] = useState(
    () =>
      initialFacility?.images
        .filter((u) => u !== initialFacility?.image_url)
        .join("\n") ?? ""
  )
  const [officialUrl, setOfficialUrl] = useState(initialFacility?.official_url ?? "")
  const [admissionFee, setAdmissionFee] = useState(initialFacility?.admission_fee ?? "")
  const [openingHours, setOpeningHours] = useState(initialFacility?.opening_hours ?? "")
  const [locationName, setLocationName] = useState(initialFacility?.location_name ?? "")
  const [prefecture, setPrefecture] = useState(initialFacility?.prefecture ?? "")
  const [operator, setOperator] = useState(initialFacility?.operator ?? "")
  const [operatorType, setOperatorType] = useState<OperatorType>(
    initialFacility?.operator_type ?? "city"
  )
  const [categoryId, setCategoryId] = useState(initialFacility?.category.id ?? mockCategories[0]?.id ?? "")
  const [linkRows, setLinkRows] = useState<FacilityLink[]>(() =>
    initialFacility?.links?.length ? initialFacility.links.map((l) => ({ ...l })) : [emptyLinkRow()]
  )

  const category = useMemo(
    () => mockCategories.find((c) => c.id === categoryId) ?? mockCategories[0],
    [categoryId]
  )

  const showDemoSave = (kind: "draft" | "published") => {
    window.alert(
      kind === "draft"
        ? "【デモ】下書き保存は、施設データを Supabase に保存する実装後に有効になります。\n詳細は docs/MUNICIPALITY_ADMIN_UI.md を参照してください。"
        : "【デモ】公開は、施設データを Supabase に保存する実装後に有効になります。"
    )
  }

  const section = (titleText: string, children: ReactNode) => (
    <section
      className="rounded-2xl p-5 md:p-6 mb-5"
      style={{ background: "#FFFFFF", border: "2px solid #C8DDD0" }}
    >
      <h2 className="text-[15px] font-extrabold text-[#1E3A2F] mb-4 pb-2 border-b border-[#E0EEE6]">
        {titleText}
      </h2>
      {children}
    </section>
  )

  const label = (text: string, required?: boolean) => (
    <label className="block text-[12px] font-bold text-[#4A7060] mb-1.5">
      {text}
      {required && <span className="text-[#D46A10] ml-0.5">*</span>}
    </label>
  )

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-[14px] border border-[#C8DDD0] bg-[#FAFCFA] text-[#1E3A2F] focus:outline-none focus:ring-2 focus:ring-[#1E7A4A]/30"

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl font-extrabold text-[#1E3A2F]">
          {mode === "new" ? "施設の新規登録" : "施設の編集"}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#88A898]">公開ステータス</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as FacilityStatus)}
            className={inputClass + " w-auto min-w-[9rem]"}
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
            <option value="unpublished">非公開</option>
          </select>
        </div>
      </div>

      {section(
        "イメージ写真",
        <>
          <p className="text-[12px] text-[#88A898] mb-4 leading-relaxed">
            メインは一覧・カードに表示されます。ファイルアップロードは Storage 連携後に追加予定です（現状は画像 URL を入力）。
          </p>
          {label("メイン画像 URL", true)}
          <input className={inputClass + " mb-4"} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          {label("追加画像 URL（1 行に 1 件）")}
          <textarea
            className={inputClass + " min-h-[88px] font-mono text-[13px]"}
            value={extraImageUrls}
            onChange={(e) => setExtraImageUrls(e.target.value)}
            placeholder={"https://example.com/photo2.jpg\nhttps://example.com/photo3.jpg"}
          />
        </>
      )}

      {section(
        "テキスト",
        <>
          {label("タイトル（施設名・キャッチ）", true)}
          <input className={inputClass + " mb-4"} value={title} onChange={(e) => setTitle(e.target.value)} />
          {label("一覧用の短い説明", true)}
          <textarea className={inputClass + " min-h-[72px] mb-4"} value={description} onChange={(e) => setDescription(e.target.value)} />
          {label("詳細本文（施設ページ用）")}
          <textarea className={inputClass + " min-h-[200px]"} value={body} onChange={(e) => setBody(e.target.value)} />
        </>
      )}

      {section(
        "リンク先",
        <>
          {label("公式・ポータルサイト（代表 URL）")}
          <input className={inputClass + " mb-4"} value={officialUrl} onChange={(e) => setOfficialUrl(e.target.value)} />
          <p className="text-[12px] text-[#88A898] mb-3">関連リンク（複数可）</p>
          <div className="space-y-3">
            {linkRows.map((row, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-2 md:items-end p-3 rounded-xl bg-[#F5F9F5] border border-[#E0EEE6]">
                <div className="flex-1 min-w-0">
                  {label("ラベル")}
                  <input
                    className={inputClass}
                    value={row.label}
                    onChange={(e) => {
                      const next = [...linkRows]
                      next[i] = { ...row, label: e.target.value }
                      setLinkRows(next)
                    }}
                    placeholder="例: 公式サイト"
                  />
                </div>
                <div className="flex-[2] min-w-0">
                  {label("URL")}
                  <input
                    className={inputClass}
                    value={row.url}
                    onChange={(e) => {
                      const next = [...linkRows]
                      next[i] = { ...row, url: e.target.value }
                      setLinkRows(next)
                    }}
                    placeholder="https://..."
                  />
                </div>
                <div className="w-full md:w-36">
                  {label("種別")}
                  <select
                    className={inputClass}
                    value={row.type}
                    onChange={(e) => {
                      const next = [...linkRows]
                      next[i] = { ...row, type: e.target.value as LinkType }
                      setLinkRows(next)
                    }}
                  >
                    {LINK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setLinkRows(linkRows.filter((_, j) => j !== i))}
                  className="text-[12px] font-bold text-[#88A898] hover:text-[#D46A10] py-2 shrink-0"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLinkRows([...linkRows, emptyLinkRow()])}
            className="mt-3 text-[13px] font-bold text-[#1E7A4A] hover:underline"
          >
            ＋ リンクを追加
          </button>
        </>
      )}

      {section(
        "一般利用者向けの情報",
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              {label("料金・利用料の目安")}
              <input className={inputClass} value={admissionFee} onChange={(e) => setAdmissionFee(e.target.value)} placeholder="例: 大人500円" />
            </div>
            <div>
              {label("営業時間・休館日")}
              <input className={inputClass} value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} placeholder="例: 9:00–17:00（月曜休）" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              {label("所在地・施設名（エリア表示）")}
              <input className={inputClass} value={locationName} onChange={(e) => setLocationName(e.target.value)} />
            </div>
            <div>
              {label("都道府県")}
              <input className={inputClass} value={prefecture} onChange={(e) => setPrefecture(e.target.value)} />
            </div>
          </div>
        </>
      )}

      {section(
        "分類・運営主体",
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              {label("カテゴリ", true)}
              <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {label("運営主体の種別")}
              <select
                className={inputClass}
                value={operatorType}
                onChange={(e) => setOperatorType(e.target.value as OperatorType)}
              >
                {OPERATOR_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            {label("運営主体名（自治体名など）", true)}
            <input className={inputClass} value={operator} onChange={(e) => setOperator(e.target.value)} placeholder="例: ○○市" />
          </div>
          <p className="text-[11px] text-[#88A898] mt-3">
            選択中カテゴリ: {category?.name ?? "—"}
          </p>
        </>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/municipality/facilities")}
          className="px-5 py-3 rounded-full text-[13px] font-bold border-2 border-[#C8DDD0] text-[#4A7060] hover:bg-[#F5F9F5]"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={() => showDemoSave("draft")}
          className="px-5 py-3 rounded-full text-[13px] font-bold text-[#1E3A2F] border-2 border-[#C8DDD0] bg-white hover:bg-[#F5F9F5]"
        >
          下書き保存（デモ）
        </button>
        <button
          type="button"
          onClick={() => showDemoSave("published")}
          className="px-5 py-3 rounded-full text-[13px] font-bold text-white shadow-md hover:opacity-90"
          style={{ background: "#1E7A4A" }}
        >
          公開する（デモ）
        </button>
      </div>
    </div>
  )
}
