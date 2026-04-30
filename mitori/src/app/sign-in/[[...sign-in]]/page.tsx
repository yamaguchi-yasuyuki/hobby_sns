import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F0EB] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-serif text-[28px] font-light tracking-[0.5em] text-[#191916]">
            MITORI
          </span>
          <p className="text-[11px] tracking-[0.2em] text-[#A09890] mt-1">
            アカウントにログイン
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white shadow-sm border border-[#DDD8CF] rounded-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border border-[#DDD8CF] text-[#191916] hover:bg-[#F3F0EB]",
              formButtonPrimary:
                "bg-[#1E3028] hover:bg-[#162520] text-white tracking-[0.05em]",
              footerActionLink: "text-[#1E3028] hover:text-[#162520]",
            },
          }}
        />
      </div>
    </div>
  )
}
