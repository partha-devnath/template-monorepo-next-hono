import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@workspace/db"
import * as schema from "@workspace/schemas"
import { emailSender } from "@workspace/email"
import { createLogger } from "@workspace/logger"

const logger = createLogger("auth")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  trustedOrigins: [process.env.CLIENT_URL ?? "http://localhost:3000"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({
      user,
      url,
      token,
    }: {
      user: { id: string; email: string }
      url: string
      token: string
    }) => {
      const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000"
      const resetUrl = `${clientUrl}/reset-password?token=${token}`
      logger.info({ userId: user.id }, "Sending reset password email")
      await emailSender.sendResetPasswordEmail({
        email: user.email,
        url: resetUrl,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { id: string; email: string }
      url: string
    }) => {
      const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000"
      const token = new URL(url).searchParams.get("token")
      const redirectUrl = token
        ? `${clientUrl}/verify-email?token=${token}`
        : url
      logger.info({ userId: user.id }, "Sending verification email")
      await emailSender.sendVerificationEmail({
        email: user.email,
        url: redirectUrl,
      })
    },
  },
})
