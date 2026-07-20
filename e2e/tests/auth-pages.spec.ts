import { test, expect } from "@playwright/test"

test.describe("Login page", () => {
  test("renders all elements", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  })

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText("Invalid email")).toBeVisible()
    await expect(page.getByText("Password must be at least")).toBeVisible()
  })

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Email").fill("not-an-email")
    await page.getByLabel("Password").fill("short")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText("Invalid email")).toBeVisible()
  })

  test("shows error for wrong credentials", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Email").fill("nonexistent@test.com")
    await page.getByLabel("Password").fill("password123")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText(/Invalid|failed|error/i)).toBeVisible()
  })

  test("links to signup page", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("link", { name: "Create account" }).click()
    await page.waitForURL("**/signup")
    await expect(
      page.getByRole("heading", { name: "Create account" })
    ).toBeVisible()
  })

  test("links to forgot password page", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("link", { name: "Forgot password?" }).click()
    await page.waitForURL("**/forgot-password")
  })
})

test.describe("Signup page", () => {
  test("renders all elements", async ({ page }) => {
    await page.goto("/signup")
    await expect(
      page.getByRole("heading", { name: "Create account" })
    ).toBeVisible()
    await expect(page.getByLabel("Name")).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(page.getByLabel("Confirm password")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Create account" })
    ).toBeVisible()
  })

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/signup")
    await page.getByRole("button", { name: "Create account" }).click()
    await expect(page.getByText("Name must be at least")).toBeVisible()
    await expect(page.getByText("Invalid email")).toBeVisible()
    await expect(page.getByText("Password must be at least")).toBeVisible()
  })

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/signup")
    await page.getByLabel("Name").fill("Test User")
    await page.getByLabel("Email").fill("test@example.com")
    await page.getByLabel("Password").fill("password123")
    await page.getByLabel("Confirm password").fill("different")
    await page.getByRole("button", { name: "Create account" }).click()
    await expect(page.getByText("Passwords do not match")).toBeVisible()
  })

  test("links to login page", async ({ page }) => {
    await page.goto("/signup")
    await page.getByRole("link", { name: "Sign in" }).click()
    await page.waitForURL("**/login")
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
  })
})

test.describe("Forgot password page", () => {
  test("renders initial form", async ({ page }) => {
    await page.goto("/forgot-password")
    await expect(
      page.getByRole("heading", { name: "Forgot password?" })
    ).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Send reset link" })
    ).toBeVisible()
  })

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/forgot-password")
    await page.getByLabel("Email").fill("bad")
    await page.getByRole("button", { name: "Send reset link" }).click()
    await expect(page.getByText("Invalid email")).toBeVisible()
  })

  test("shows success state after submitting valid email", async ({ page }) => {
    await page.goto("/forgot-password")
    await page.getByLabel("Email").fill("test@example.com")
    await page.getByRole("button", { name: "Send reset link" }).click()
    await expect(
      page.getByRole("heading", { name: "Check your email" })
    ).toBeVisible()
  })

  test("links back to login", async ({ page }) => {
    await page.goto("/forgot-password")
    await page.getByRole("link", { name: "Back to login" }).click()
    await page.waitForURL("**/login")
  })
})

test.describe("Reset password page", () => {
  test("shows invalid link state when no token", async ({ page }) => {
    await page.goto("/reset-password")
    await expect(
      page.getByRole("heading", { name: "Invalid reset link" })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Request a new link" })
    ).toBeVisible()
  })

  test("shows form when token is present", async ({ page }) => {
    await page.goto("/reset-password?token=valid-token-123")
    await expect(
      page.getByRole("heading", { name: "Reset password" })
    ).toBeVisible()
    await expect(page.getByLabel("New password")).toBeVisible()
    await expect(page.getByLabel("Confirm new password")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Reset password" })
    ).toBeVisible()
  })

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/reset-password?token=test-token")
    await page.getByRole("button", { name: "Reset password" }).click()
    await expect(page.getByText("Password must be at least")).toBeVisible()
  })

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/reset-password?token=test-token")
    await page.getByLabel("New password").fill("password123")
    await page.getByLabel("Confirm new password").fill("different")
    await page.getByRole("button", { name: "Reset password" }).click()
    await expect(page.getByText("Passwords do not match")).toBeVisible()
  })
})

test.describe("Verify email page", () => {
  test("shows prompt when no token", async ({ page }) => {
    await page.goto("/verify-email")
    await expect(
      page.getByRole("heading", { name: "Verify your email" })
    ).toBeVisible()
    await expect(
      page.getByText("We sent you a verification link")
    ).toBeVisible()
  })

  test("links back to login when no token", async ({ page }) => {
    await page.goto("/verify-email")
    await page.getByRole("link", { name: "Back to login" }).click()
    await page.waitForURL("**/login")
  })
})
