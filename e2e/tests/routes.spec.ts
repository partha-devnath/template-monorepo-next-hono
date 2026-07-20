import { test, expect } from "@playwright/test"

test.describe("Route guards", () => {
  test("home page redirects to dashboard", async ({ page }) => {
    await page.goto("/")
    await page.waitForURL("**/dashboard")
    expect(page.url()).toContain("/dashboard")
  })

  test("dashboard redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard")
    await page.waitForURL("**/login")
    expect(page.url()).toContain("/login")
  })

  test("protected route returns 401 JSON", async ({ request }) => {
    const API_URL = process.env.E2E_API_URL ?? "http://localhost:3001"
    const res = await request.get(`${API_URL}/api/protected`)
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toBe("Unauthorized")
  })
})

test.describe("Auth page redirects when authenticated", () => {
  test("login page redirects to dashboard with session cookie", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "session_token",
        value: "fake-session",
        domain: "localhost",
        path: "/",
      },
    ])
    await page.goto("/login")
    await page.waitForURL("**/dashboard")
    expect(page.url()).toContain("/dashboard")
  })

  test("signup page redirects to dashboard with session cookie", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "session_token",
        value: "fake-session",
        domain: "localhost",
        path: "/",
      },
    ])
    await page.goto("/signup")
    await page.waitForURL("**/dashboard")
    expect(page.url()).toContain("/dashboard")
  })
})

test.describe("404 page", () => {
  test("shows not found for unknown routes", async ({ page }) => {
    await page.goto("/this-path-does-not-exist")
    await expect(page.getByText("404")).toBeVisible()
    await expect(page.getByText("Page not found")).toBeVisible()
  })

  test("links back to dashboard", async ({ page }) => {
    await page.goto("/nonexistent")
    await page.getByRole("link", { name: "Back to dashboard" }).click()
    await page.waitForURL("**/dashboard")
  })
})

test.describe("Error page", () => {
  test("error page renders with try again button", async ({ page }) => {
    await page.goto("/error")
    await expect(page.getByText("Something went wrong")).toBeVisible()
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible()
  })
})
