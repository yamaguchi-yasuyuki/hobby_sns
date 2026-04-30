import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { mockContents } from "@/lib/mock-data"

type EditPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminContentEditPage({ params }: EditPageProps) {
  const { id } = await params
  const content = mockContents.find((c) => c.id === id)

  if (!content) notFound()

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/contents"
          className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#2D4A3E] transition-colors"
        >
          <ArrowLeft size={15} />
          一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-[#2C2C2C]">コンテンツ編集</h1>
      </div>

      <div className="bg-white rounded-xl border border-[#E2DED8] p-4">
        <p className="text-sm text-[#6B6B6B]">
          編集フォームはコンテンツ新規登録と同様の構成です。（モック環境）
        </p>
        <div className="mt-4 p-3 bg-[#F7F5F2] rounded-lg text-xs text-[#6B6B6B] font-mono">
          <p>ID: {content.id}</p>
          <p>タイトル: {content.title}</p>
          <p>ジャンル: {content.genre.name}</p>
          <p>ステータス: {content.status}</p>
          <p>保存数: {content.bookmark_count}</p>
        </div>
      </div>
    </div>
  )
}
