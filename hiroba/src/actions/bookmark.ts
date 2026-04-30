"use server"

import { auth } from "@clerk/nextjs/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers"

export async function getBookmarkIdsAction(): Promise<string[]> {
  const { userId } = await auth()
  if (!userId) return []

  const user = await ensureSupabaseUser()
  if (!user) return []

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from("bookmarks")
    .select("facility_id")
    .eq("user_id", user.id)

  return data?.map((b) => b.facility_id) ?? []
}

export async function toggleBookmarkAction(facilityId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("ログインが必要です")
  }

  const user = await ensureSupabaseUser()
  if (!user) {
    throw new Error("ユーザー情報の同期に失敗しました")
  }

  const supabase = createServiceRoleClient()

  const { data: existing, error: selectErr } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("facility_id", facilityId)
    .maybeSingle()

  if (selectErr) throw selectErr

  if (existing) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      facility_id: facilityId,
      category: "未分類",
    })
    if (error) throw error
  }
}
