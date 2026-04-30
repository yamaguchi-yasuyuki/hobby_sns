import { auth, currentUser } from '@clerk/nextjs/server'
import { accountKindFromClerkUser } from '@/lib/hiroba/account-kind'
import { createServiceRoleClient } from './service-role'

export async function ensureSupabaseUser() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  const account_kind = accountKindFromClerkUser(user)

  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        clerk_user_id: userId,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        account_kind,
      },
      { onConflict: 'clerk_user_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSupabaseUserByClerkId() {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  return data ?? null
}
