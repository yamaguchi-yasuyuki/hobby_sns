'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function toggleBookmark(contentId: string, category = '未分類') {
  const { userId } = await auth()
  if (!userId) {
    return { error: 'ログインが必要です' }
  }

  const supabaseUser = await ensureSupabaseUser()
  if (!supabaseUser) {
    return { error: 'ユーザー情報の取得に失敗しました' }
  }

  const supabase = createServiceRoleClient()

  // 既存ブックマークを確認
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', supabaseUser.id)
    .eq('content_id', contentId)
    .maybeSingle()

  if (existing) {
    // 削除
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id)

    if (error) return { error: error.message }
    revalidatePath('/')
    revalidatePath('/collection')
    return { bookmarked: false }
  } else {
    // 追加
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: supabaseUser.id,
        content_id: contentId,
        category,
      })

    if (error) return { error: error.message }
    revalidatePath('/')
    revalidatePath('/collection')
    return { bookmarked: true }
  }
}

export async function getBookmarkedIds(): Promise<string[]> {
  const { userId } = await auth()
  if (!userId) return []

  const supabaseUser = await ensureSupabaseUser()
  if (!supabaseUser) return []

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('bookmarks')
    .select('content_id')
    .eq('user_id', supabaseUser.id)

  return data?.map((b) => b.content_id) ?? []
}
