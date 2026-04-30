"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/"
  const defaultTab = (searchParams.get("tab") ?? "login") as "login" | "signup"

  const { login } = useAuth()
  const [tab, setTab] = useState<"login" | "signup">(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password) {
      setError("メールアドレスとパスワードを入力してください")
      return
    }
    if (form.password.length < 6) {
      setError("パスワードは6文字以上にしてください")
      return
    }

    setIsLoading(true)
    // モック：実際はSupabase/Clerk等のAPIを呼ぶ
    await new Promise((r) => setTimeout(r, 800))
    login(form.email, form.name)
    router.push(redirect)
  }

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    login(`${provider}_user@example.com`, provider === "google" ? "Google ユーザー" : "Apple ユーザー")
    router.push(redirect)
  }

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2DED8] bg-white text-sm text-[#2C2C2C] focus:outline-none focus:border-[#2D4A3E] transition-colors placeholder:text-[#C4BDB5]"

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col">
      {/* ヘッダー */}
      <div className="px-5 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          戻る
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-12">
        <div className="w-full max-w-sm">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <span className="font-serif text-[28px] font-light tracking-[0.5em] text-[#191916]">
              MITORI
            </span>
            <p className="text-[11px] tracking-[0.2em] text-[#A09890] mt-1">
              {tab === "login" ? "アカウントにログイン" : "新規アカウント登録"}
            </p>
          </div>

          {/* タブ */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: "#EEEAE4" }}
          >
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError("") }}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  tab === t
                    ? "bg-white text-[#191916] shadow-sm"
                    : "text-[#A09890] hover:text-[#605A52]"
                )}
              >
                {t === "login" ? "ログイン" : "新規登録"}
              </button>
            ))}
          </div>

          {/* ソーシャルログイン */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#E2DED8] bg-white text-sm font-medium text-[#2C2C2C] hover:bg-[#F7F5F2] transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Googleで{tab === "login" ? "ログイン" : "登録"}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("apple")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#191916] text-sm font-medium text-white hover:bg-[#2C2C2C] transition-colors disabled:opacity-50"
            >
              <svg width="16" height="18" viewBox="0 0 814 1000" fill="white">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.3-168.3-118.7c-73.4-87.6-141.2-234.5-141.2-374.3 0-208.8 136.1-319.2 270-319.2 69.5 0 127.2 45.8 170.9 45.8 42.8 0 109.9-48.4 190.5-48.4 30.7 0 108.2 2.5 168.7 73.4zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              Appleで{tab === "login" ? "ログイン" : "登録"}
            </button>
          </div>

          {/* 区切り */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#E2DED8]" />
            <span className="text-[11px] text-[#C4BDB5] tracking-[0.1em]">または</span>
            <div className="flex-1 h-px bg-[#E2DED8]" />
          </div>

          {/* メールフォーム */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "signup" && (
              <div className="relative">
                <User size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4BDB5]" />
                <input
                  type="text"
                  placeholder="お名前（ニックネーム可）"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4BDB5]" />
              <input
                type="email"
                placeholder="メールアドレス"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4BDB5]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="パスワード（6文字以上）"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={cn(inputClass, "pr-11")}
                required
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C4BDB5] hover:text-[#6B6B6B] transition-colors"
                aria-label={showPassword ? "隠す" : "表示する"}
              >
                {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 px-1">{error}</p>
            )}

            {tab === "login" && (
              <div className="text-right">
                <button type="button" className="text-xs text-[#A09890] hover:text-[#605A52] transition-colors">
                  パスワードを忘れた方
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#1E3028] text-white text-sm font-medium tracking-[0.05em] hover:bg-[#162520] transition-colors disabled:opacity-60 mt-2"
            >
              {isLoading
                ? "処理中..."
                : tab === "login" ? "ログイン" : "アカウントを作成"}
            </button>
          </form>

          {/* 利用規約 */}
          {tab === "signup" && (
            <p className="text-[11px] text-[#A09890] text-center mt-4 leading-relaxed">
              登録することで
              <button className="underline hover:text-[#605A52] transition-colors">利用規約</button>
              および
              <button className="underline hover:text-[#605A52] transition-colors">プライバシーポリシー</button>
              に同意したことになります
            </p>
          )}

          {/* ゲスト利用 */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-[#A09890] hover:text-[#605A52] transition-colors underline underline-offset-2"
            >
              登録せずに見る（コレクションはこの端末のみ）
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
