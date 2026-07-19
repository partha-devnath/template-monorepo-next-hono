import { createAuthClient } from "better-auth/react"

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} = createAuthClient({
  baseURL: "http://localhost:3000",
})
