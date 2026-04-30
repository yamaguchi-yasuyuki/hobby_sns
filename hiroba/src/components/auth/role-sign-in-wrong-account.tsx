"use client"

import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"

type Props = {
  title: string
  explanation: string
  afterSignOutRedirectUrl: string
  backHref?: string
  backLabel?: string
}

export function RoleSignInWrongAccount({
  title,
  explanation,
  afterSignOutRedirectUrl,
  backHref = "/",
  backLabel = "一般の方はトップへ",
}: Props) {
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
          className="rounded-3xl p-6 md:p-8"
          style={{
            background: "#FFFFFF",
            border: "2px solid #C8DDD0",
            boxShadow: "0 8px 28px rgba(30, 58, 47, 0.08)",
          }}
        >
          <h1 className="text-xl font-extrabold text-[#1E3A2F] tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-[14px] text-[#4A7060] leading-relaxed mb-6">
            {explanation}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <SignOutButton
              signOutOptions={{ redirectUrl: afterSignOutRedirectUrl }}
            >
              <button
                type="button"
                className="inline-flex justify-center items-center px-5 py-3 rounded-full text-[13px] font-bold text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
                style={{ background: "#1E7A4A" }}
              >
                ログアウトして別アカウントで入る
              </button>
            </SignOutButton>
            <Link
              href={backHref}
              className="inline-flex justify-center items-center px-5 py-3 rounded-full text-[13px] font-bold text-[#1E7A4A] border-2 border-[#C8DDD0] hover:bg-[#F5F9F5]"
            >
              トップへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
