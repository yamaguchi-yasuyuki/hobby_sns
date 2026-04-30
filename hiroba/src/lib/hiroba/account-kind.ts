import type { User } from "@clerk/nextjs/server"

/** DB / Clerk publicMetadata で共通利用（Clerk キーは hirobaAccountKind） */
export const HIROBA_ACCOUNT_KINDS = [
  "general",
  "municipality_staff",
  "platform_operator",
] as const

export type HirobaAccountKind = (typeof HIROBA_ACCOUNT_KINDS)[number]

export const CLERK_PUBLIC_METADATA_ACCOUNT_KIND_KEY = "hirobaAccountKind" as const

export function parseHirobaAccountKind(raw: unknown): HirobaAccountKind {
  if (raw === "platform_operator" || raw === "municipality_staff" || raw === "general") {
    return raw
  }
  return "general"
}

/** Clerk の publicMetadata から種別を取得（未設定は general） */
export function accountKindFromClerkUser(user: User | null): HirobaAccountKind {
  if (!user) return "general"
  const raw = user.publicMetadata[CLERK_PUBLIC_METADATA_ACCOUNT_KIND_KEY]
  return parseHirobaAccountKind(raw)
}

export function isPlatformOperatorKind(kind: HirobaAccountKind): boolean {
  return kind === "platform_operator"
}

export function isMunicipalityStaffKind(kind: HirobaAccountKind): boolean {
  return kind === "municipality_staff"
}
