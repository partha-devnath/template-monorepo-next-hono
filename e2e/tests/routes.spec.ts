import { test, expect } from "@playwright/test"

test.describe("Route guards", () => {
  test("home page redirects through dashboard to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" })
    await page.waitForURL("**/login", { timeout: 15000 })
    expect(page.url()).toContain("/login")
  })

  test("dashboard redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard", { waitUntil: "load" })
    await page.waitForURL("**/login", { timeout: 15000 })
    expect(page.url()).toContain("/login")
  })

  test("protected API route returns 401 JSON", async ({ request }) => {
    const API_URL = process.env.E2E_API_URL ?? "http://localhost:3001"
    const res = await request.get(`${API_URL}/api/protected`)
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toBe("Unauthorized")
  })
})

test.describe("404 page", () => {
  test("shows not found for unknown routes", async ({ page }) => {
    await page.goto("/this-path-does-not-exist", { waitUntil: "load" })
    await expect(page.getByText("404")).toBeVisible({ timeout: 15000 })
    await expect(page.getByText("Page not found")).toBeVisible()
  })

  test("404 page links back to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/nonexistent", { waitUntil: "load" })
    await page.getByRole("link", { name: "Back to dashboard" }).click()
    // /dashboard is protected → middleware redirects to /login
    await page.waitForURL("**/login", { timeout: 15000 })
    expect(page.url()).toContain("/login")
  })
})

test.describe("Next.js middleware", () => {
  test("login page does not redirect without session cookie", async ({
    page,
  }) => {
    const response = await page.goto("/login", { waitUntil: "load" })
    expect(response?.status()).toBe(200)
    expect(page.url()).toContain("/login")
  })

  test("auth page access works for public routes", async ({ page }) => {
    const response = await page.goto("/forgot-password", {
      waitUntil: "load",
    })
    expect(response?.status()).toBe(200)
  })
})
