import Image from "next/image"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { mockFacilities } from "@/lib/mock-data"
import FacilityStaffDeleteButton from "@/components/admin/municipality/FacilityStaffDeleteButton"

const statusLabel: Record<string, string> = {
  published: "公開",
  draft: "下書き",
  unpublished: "非公開",
}

export default function MunicipalityFacilitiesListPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl font-extrabold text-[#1E3A2F]">施設一覧</h1>
        <Link
          href="/admin/municipality/facilities/new"
          className="inline-flex justify-center items-center px-5 py-2.5 rounded-full text-[13px] font-bold text-white shadow-sm hover:opacity-90"
          style={{ background: "#1E7A4A" }}
        >
          ＋ 新規登録
        </Link>
      </div>

      <p className="text-[13px] text-[#88A898] mb-4">
        デモではモックデータを表示しています。保存・削除は Supabase の施設テーブル追加後に接続します。
      </p>

      <div className="rounded-2xl overflow-hidden border-2 border-[#C8DDD0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#F5F9F5] text-[#4A7060] font-bold border-b border-[#E0EEE6]">
                <th className="py-3 pl-4 pr-2 w-14">画像</th>
                <th className="py-3 px-2 min-w-[200px]">タイトル</th>
                <th className="py-3 px-2 whitespace-nowrap">カテゴリ</th>
                <th className="py-3 px-2 whitespace-nowrap">ステータス</th>
                <th className="py-3 px-2 whitespace-nowrap hidden lg:table-cell">所在地</th>
                <th className="py-3 pr-4 pl-2 text-right whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockFacilities.map((f) => (
                <tr key={f.id} className="border-b border-[#E0EEE6] last:border-0 hover:bg-[#FAFCFA]">
                  <td className="py-2 pl-4 pr-2 align-middle">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#E8F5ED] shrink-0">
                      <Image src={f.image_url} alt="" fill className="object-cover" unoptimized sizes="48px" />
                    </div>
                  </td>
                  <td className="py-2 px-2 align-middle font-medium text-[#1E3A2F] max-w-[280px]">
                    <span className="line-clamp-2">{f.title}</span>
                  </td>
                  <td className="py-2 px-2 align-middle text-[#4A7060]">{f.category.name}</td>
                  <td className="py-2 px-2 align-middle">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{
                        background: f.status === "published" ? "#E8F5ED" : "#FEF0E7",
                        color: f.status === "published" ? "#1E7A4A" : "#D46A10",
                      }}
                    >
                      {statusLabel[f.status] ?? f.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 align-middle text-[#88A898] hidden lg:table-cell">
                    {f.prefecture}
                    {f.location_name ? ` · ${f.location_name}` : ""}
                  </td>
                  <td className="py-2 pr-4 pl-2 align-middle text-right">
                    <div className="inline-flex items-center gap-1 flex-wrap justify-end">
                      <Link
                        href={`/admin/municipality/facilities/${f.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-bold text-[#1E7A4A] hover:bg-[#E8F5ED]"
                      >
                        <Pencil size={14} />
                        編集
                      </Link>
                      <FacilityStaffDeleteButton facilityTitle={f.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
