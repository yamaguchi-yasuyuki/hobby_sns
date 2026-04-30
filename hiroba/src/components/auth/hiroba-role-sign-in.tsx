"use client"

import { SignIn } from "@clerk/nextjs"
import Link from "next/link"

type HirobaRoleSignInProps = {
  signUpPath: string
  afterAuthUrl: string
  title: string
  description: string
  hint?: string
  backHref?: string
  backLabel?: string
}

export function HirobaRoleSignIn({
  signUpPath,
  afterAuthUrl,
  title,
  description,
  hint = "Google アカウントでのログインを想定しています。Clerk のダッシュボードで Google 連携を有効にしてください。",
  backHref = "/",
  backLabel = "一般の方はトップへ",
}: HirobaRoleSignInProps) {
  return (
    <div className="min-h-[70vh] px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Link
          href={backHref}
          className="inline-flex text-[13px] font-medium text-[#1E7A4A] hover:underline mb-6"
        >
          ← {backLabel}
        </Link>
        <div
          className="rounded-3xl p-6 md:p-8 mb-6"
          style={{
            background: "#FFFFFF",
            border: "2px solid #C8DDD0",
            boxShadow: "0 8px 28px rgba(30, 58, 47, 0.08)",
          }}
        >
          <h1 className="text-xl font-extrabold text-[#1E3A2F] tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-[14px] text-[#4A7060] leading-relaxed mb-3">
            {description}
          </p>
          <p className="text-[12px] text-[#88A898] leading-relaxed mb-6">{hint}</p>
          <div className="flex justify-center clerk-sign-in-scope">
            {/*
              hash: Clerk ダッシュボードの「サインイン URL」が /sign-in のみでも動かしやすい。
              path: 要 Clerk の Paths / リダイレクト許可に /sign-in/staff 等の明示設定。
            */}
            <SignIn
              routing="hash"
              signUpUrl={signUpPath}
              forceRedirectUrl={afterAuthUrl}
              fallbackRedirectUrl={afterAuthUrl}
              signUpForceRedirectUrl={afterAuthUrl}
              signUpFallbackRedirectUrl={afterAuthUrl}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
