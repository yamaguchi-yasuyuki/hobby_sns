import { createClient } from '@supabase/supabase-js'

/**
 * JWT 形式のキーなら payload.role を確認。anon / publishable を誤って渡すと RLS で 42501 になる。
 */
function assertServiceRoleJwt(key: string): void {
  const parts = key.split('.')
  if (parts.length !== 3) return

  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const json = Buffer.from(padded, 'base64').toString('utf8')
    const payload = JSON.parse(json) as { role?: string }
    if (payload.role && payload.role !== 'service_role') {
      throw new Error(
        `SUPABASE_SERVICE_ROLE_KEY が service_role ではありません（JWT の role: "${payload.role}"）。` +
          ` Supabase Dashboard → Settings → API で「service_role」のシークレット（JWT）をコピーしてください。` +
          ` 「anon」「Publishable」キーはサーバーでは使えません。`
      )
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('SUPABASE_SERVICE_ROLE_KEY')) throw e
  }
}

export function createServiceRoleClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY が設定されていません')
  }

  assertServiceRoleJwt(key)

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
