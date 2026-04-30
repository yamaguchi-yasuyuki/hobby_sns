/** Next.js: クライアントが古い Server Action ID を保持しているとき（.next ずれ・複数 dev サーバー等） */
export function isStaleNextServerActionError(e: unknown): boolean {
  const msg = formatSupabaseError(e)
  return (
    msg.includes("was not found on the server") ||
    msg.includes("UnrecognizedActionError") ||
    msg.includes("failed-to-find-server-action")
  )
}

/** PostgREST / GoTrue が返すエラー形のことが多い */
export function formatSupabaseError(e: unknown): string {
  if (e == null) return '不明なエラー'
  if (typeof e === 'string') return e
  if (e instanceof Error) return e.message
  if (typeof e === 'object') {
    const o = e as Record<string, unknown>
    const code = o.code != null ? String(o.code) : ''
    const msg = o.message != null ? String(o.message) : ''
    const hint = o.hint != null ? String(o.hint) : ''
    const details = o.details != null ? String(o.details) : ''
    const parts = [code && `code=${code}`, msg, hint && `hint=${hint}`, details && `details=${details}`].filter(
      Boolean
    )
    if (parts.length) return parts.join(' | ')
  }
  try {
    return JSON.stringify(e)
  } catch {
    return String(e)
  }
}
