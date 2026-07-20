import { test, expect } from "@playwright/test"

test.describe("Login page", () => {
  test("renders all elements", async ({ page }) => {
    await page.goto("/login", { waitUntil: "load" })
    // PublicLayout shows "Loading..." until session check completes
    await page
      .getByText("Sign in")
      .first()
      .waitFor({ state: "visible", timeout: 20000 })
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  })

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/login", { waitUntil: "load" })
    await page
      .getByRole("button", { name: "Sign in" })
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText("Invalid email")).toBeVisible()
    await expect(page.getByText("Password must be at least")).toBeVisible()
  })

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/login", { waitUntil: "load" })
    await page
      .getByRole("button", { name: "Sign in" })
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByLabel("Email").fill("not-an-email")
    await page.getByLabel("Password", { exact: true }).fill("short")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByText("Invalid email address")).toBeVisible()
  })

  test("shows error for wrong credentials", async ({ page }) => {
    await page.goto("/login", { waitUntil: "load" })
    await page
      .getByRole("button", { name: "Sign in" })
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByLabel("Email").fill("testuser@example.com")
    await page.getByLabel("Password", { exact: true }).fill("WrongPassword123")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(
      page.getByText(/invalid|failed|error|incorrect|wrong/i)
    ).toBeVisible({ timeout: 15000 })
  })

  test("links to signup page", async ({ page }) => {
    await page.goto("/login", { waitUntil: "load" })
    await page
      .getByText("Create account")
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("link", { name: "Create account" }).click()
    await page.waitForURL("**/signup")
    await page
      .getByText("Create account")
      .first()
      .waitFor({ state: "visible", timeout: 20000 })
  })

  test("links to forgot password page", async ({ page }) => {
    await page.goto("/login", { waitUntil: "load" })
    await page
      .getByText("Forgot password?")
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("link", { name: "Forgot password?" }).click()
    await page.waitForURL("**/forgot-password")
  })
})

test.describe("Signup page", () => {
  test("renders all elements", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "load" })
    await page
      .getByText("Create account")
      .first()
      .waitFor({ state: "visible", timeout: 20000 })
    await expect(page.getByLabel("Name")).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
    await expect(page.getByLabel("Confirm password")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Create account" })
    ).toBeVisible()
  })

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "load" })
    await page
      .getByRole("button", { name: "Create account" })
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("button", { name: "Create account" }).click()
    await expect(page.getByText("Name must be at least")).toBeVisible()
    await expect(page.getByText("Invalid email")).toBeVisible()
    await expect(page.getByText("Password must be at least")).toBeVisible()
  })

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "load" })
    await page.getByLabel("Name").waitFor({ state: "visible", timeout: 20000 })
    await page.getByLabel("Name").fill("Test User")
    await page.getByLabel("Email").fill("test@example.com")
    await page.getByLabel("Password", { exact: true }).fill("TestPass123")
    await page.getByLabel("Confirm password").fill("DifferentPass456")
    await page.getByRole("button", { name: "Create account" }).click()
    await expect(page.getByText("Passwords don't match")).toBeVisible()
  })

  test("links to login page", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "load" })
    await page
      .getByText("Sign in")
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("link", { name: "Sign in" }).click()
    await page.waitForURL("**/login")
    await page
      .getByText("Sign in")
      .first()
      .waitFor({ state: "visible", timeout: 20000 })
  })
})

test.describe("Forgot password page", () => {
  test("renders initial form", async ({ page }) => {
    await page.goto("/forgot-password", { waitUntil: "load" })
    await page
      .getByText("Forgot password?")
      .first()
      .waitFor({ state: "visible", timeout: 20000 })
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Send reset link" })
    ).toBeVisible()
  })

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/forgot-password", { waitUntil: "load" })
    await page.getByLabel("Email").waitFor({ state: "visible", timeout: 20000 })
    await page.getByLabel("Email").fill("bad")
    await page.getByRole("button", { name: "Send reset link" }).click()
    await expect(page.getByText("Invalid email address")).toBeVisible()
  })

  test("shows success state after submitting valid email", async ({ page }) => {
    await page.goto("/forgot-password", { waitUntil: "load" })
    await page.getByLabel("Email").waitFor({ state: "visible", timeout: 20000 })
    await page.getByLabel("Email").fill("testuser@example.com")
    await page.getByRole("button", { name: "Send reset link" }).click()
    await page
      .getByText("Check your email")
      .waitFor({ state: "visible", timeout: 20000 })
  })

  test("links back to login", async ({ page }) => {
    await page.goto("/forgot-password", { waitUntil: "load" })
    await page
      .getByText("Back to login")
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("link", { name: "Back to login" }).click()
    await page.waitForURL("**/login")
  })
})

test.describe("Reset password page", () => {
  test("shows invalid link state when no token", async ({ page }) => {
    await page.goto("/reset-password", { waitUntil: "load" })
    await page
      .getByText("Invalid reset link")
      .waitFor({ state: "visible", timeout: 20000 })
    await expect(
      page.getByRole("link", { name: "Request a new link" })
    ).toBeVisible()
  })

  test("shows form when token is present", async ({ page }) => {
    await page.goto("/reset-password?token=valid-token-123", {
      waitUntil: "load",
    })
    await page
      .getByText("Reset password")
      .first()
      .waitFor({ state: "visible", timeout: 20000 })
    await expect(
      page.getByRole("textbox", { name: "New password", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("textbox", { name: "Confirm new password" })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Reset password" })
    ).toBeVisible()
  })

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/reset-password?token=test-token", { waitUntil: "load" })
    await page
      .getByRole("button", { name: "Reset password" })
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("button", { name: "Reset password" }).click()
    await expect(page.getByText("Password must be at least")).toBeVisible()
  })

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/reset-password?token=test-token", { waitUntil: "load" })
    await page
      .getByRole("textbox", { name: "New password", exact: true })
      .waitFor({ state: "visible", timeout: 20000 })
    await page
      .getByRole("textbox", { name: "New password", exact: true })
      .fill("TestPass123")
    await page
      .getByRole("textbox", { name: "Confirm new password" })
      .fill("DifferentPass456")
    await page.getByRole("button", { name: "Reset password" }).click()
    await expect(page.getByText("Passwords don't match")).toBeVisible()
  })
})

test.describe("Verify email page", () => {
  test("shows prompt when no token", async ({ page }) => {
    await page.goto("/verify-email", { waitUntil: "load" })
    await page
      .getByRole("heading", { name: /verify your email/i })
      .waitFor({ state: "visible", timeout: 20000 })
    await expect(
      page.getByText(/we sent you a verification link/i)
    ).toBeVisible()
  })

  test("links back to login when no token", async ({ page }) => {
    await page.goto("/verify-email", { waitUntil: "load" })
    await page
      .getByText("Back to login")
      .waitFor({ state: "visible", timeout: 20000 })
    await page.getByRole("link", { name: "Back to login" }).click()
    await page.waitForURL("**/login")
  })
})
