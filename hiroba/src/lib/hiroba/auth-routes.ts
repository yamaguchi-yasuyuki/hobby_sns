/** 運営者・自治体職員向けの専用サインイン URL とログイン後の遷移先 */

export const HIROBA_AUTH_ROUTES = {
  operator: {
    signInPath: "/sign-in/operator",
    signUpPath: "/sign-up/operator",
    afterAuth: "/admin/platform",
  },
  staff: {
    signInPath: "/sign-in/staff",
    signUpPath: "/sign-up/staff",
    afterAuth: "/admin/municipality",
  },
} as const
