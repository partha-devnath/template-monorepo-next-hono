import { test, expect } from "@playwright/test"

test("API health endpoint returns ok", async ({ request }) => {
  const baseURL = process.env.E2E_API_URL ?? "http://localhost:3001"
  const res = await request.get(`${baseURL}/api/health`)
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  expect(body.success).toBe(true)
  expect(body.data.status).toBe("ok")
  expect(body.data.db).toBe("connected")
})

test("home page redirects to dashboard", async ({ page }) => {
  await page.goto("/")
  await page.waitForURL("**/dashboard")
  expect(page.url()).toContain("/dashboard")
})

test("login page renders", async ({ page }) => {
  await page.goto("/login")
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
  await expect(page.getByLabel("Email")).toBeVisible()
  await expect(page.getByLabel("Password")).toBeVisible()
})

test("signup page renders", async ({ page }) => {
  await page.goto("/signup")
  await expect(
    page.getByRole("heading", { name: "Create account" })
  ).toBeVisible()
  await expect(page.getByLabel("Name")).toBeVisible()
  await expect(page.getByLabel("Email")).toBeVisible()
  await expect(page.getByLabel("Password")).toBeVisible()
  await expect(page.getByLabel("Confirm password")).toBeVisible()
})
