import { readFileSync } from "node:fs"
import { resolve } from "node:path"

if (!process.env.DATABASE_URL) {
  const envPath = resolve(import.meta.dir, "../../../apps/api/.env")
  const envContent = readFileSync(envPath, "utf-8")
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIndex = trimmed.indexOf("=")
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

const { db, closeDb, runMigrations } = await import("@workspace/db")
const schema = await import("@workspace/schemas")
const { eq } = await import("drizzle-orm")

async function seedTestUser() {
  const existing = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, "testuser@example.com"))
    .limit(1)

  if (existing.length > 0) {
    console.log("Test user already exists, skipping seed")
    return
  }

  const apiUrl = process.env.E2E_API_URL ?? "http://localhost:3001"
  const res = await fetch(`${apiUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: "testuser@example.com",
      password: "TestPass123!",
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to create test user: ${res.status} ${body}`)
  }

  const [userRecord] = await db
    .update(schema.user)
    .set({ emailVerified: true })
    .where(eq(schema.user.email, "testuser@example.com"))
    .returning()

  console.log("Test user seeded successfully:", userRecord?.id)
}

async function main() {
  console.log("Running E2E test setup...")
  await runMigrations()

  try {
    await seedTestUser()
  } catch (error) {
    console.error("Seed failed:", error)
  }

  await closeDb()
  console.log("E2E test setup complete")
}

main()
