import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 本番環境ではDBへの書き込みに置き換える
const clickLog = new Map<string, number>()

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const contentId = searchParams.get("cid") ?? ""
  const linkIndex  = searchParams.get("idx") ?? "0"
  const to         = searchParams.get("to")  ?? ""

  if (!to) {
    return new NextResponse("Missing destination URL", { status: 400 })
  }

  // バリデーション：httpsのみ許可
  try {
    const parsed = new URL(to)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return new NextResponse("Invalid URL", { status: 400 })
    }
  } catch {
    return new NextResponse("Invalid URL", { status: 400 })
  }

  // クリック数をインクリメント（本番: DB upsert）
  const key = `${contentId}:${linkIndex}`
  clickLog.set(key, (clickLog.get(key) ?? 0) + 1)

  console.log(`[track] content=${contentId} link=${linkIndex} clicks=${clickLog.get(key)} → ${to}`)

  return NextResponse.redirect(to, { status: 302 })
}
