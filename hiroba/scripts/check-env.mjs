/**
 * Validates required env vars for local dev (Clerk + Supabase).
 * Run from hiroba/: npm run check:env
 */
import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const envPath = resolve(root, ".env.local")

const REQUIRED = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
]

function parseEnvFile(content) {
  const out = {}
  for (const line of content.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

function main() {
  if (!existsSync(envPath)) {
    console.error(`Missing ${envPath}`)
    console.error("Copy .env.local.example to .env.local and fill values.")
    process.exit(1)
  }

  let raw
  try {
    raw = readFileSync(envPath, "utf8")
  } catch (e) {
    console.error("Could not read .env.local:", e.message)
    process.exit(1)
  }

  const env = { ...process.env, ...parseEnvFile(raw) }
  const missing = REQUIRED.filter((k) => !env[k] || String(env[k]).trim() === "")

  if (missing.length) {
    console.error("Missing or empty required variables in .env.local:")
    for (const k of missing) console.error(`  - ${k}`)
    process.exit(1)
  }

  const pub = String(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).trim()
  const svc = String(env.SUPABASE_SERVICE_ROLE_KEY).trim()
  if (pub && svc && pub === svc) {
    console.warn(
      "Warning: SUPABASE_SERVICE_ROLE_KEY equals NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      "Use the service_role secret from Supabase Dashboard → Settings → API, not the anon key.",
    )
  }

  console.log("OK: required Clerk + Supabase variables are set in .env.local")
}

main()
