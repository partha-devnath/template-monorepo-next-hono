import { test, expect } from "@playwright/test"

const API_URL = process.env.E2E_API_URL ?? "http://localhost:3001"

test("health endpoint returns ok with db connected", async ({ request }) => {
  const res = await request.get(`${API_URL}/api/health`)
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  expect(body.success).toBe(true)
  expect(body.data.status).toBe("ok")
  expect(body.data.db).toBe("connected")
  expect(body.data.requestId).toBeDefined()
})

test("protected endpoint rejects unauthenticated requests", async ({
  request,
}) => {
  const res = await request.get(`${API_URL}/api/protected`)
  expect(res.status()).toBe(401)
  const body = await res.json()
  expect(body.success).toBe(false)
  expect(body.error).toBe("Unauthorized")
})

test("auth endpoints are rate limited", async ({ request }) => {
  const requests = Array.from({ length: 35 }, (_, i) =>
    request.post(`${API_URL}/api/auth/test`, {
      data: { seq: i },
    })
  )
  const results = await Promise.all(requests)
  const statuses = results.map((r) => r.status())
  const tooMany = statuses.filter((s) => s === 429)
  expect(tooMany.length).toBeGreaterThan(0)
})

test("CORS headers are set", async ({ request }) => {
  const res = await request.get(`${API_URL}/api/health`)
  const corsOrigin = res.headers()["access-control-allow-origin"]
  expect(corsOrigin).toBe("http://localhost:3000")
})

test("security headers are present", async ({ request }) => {
  const res = await request.get(`${API_URL}/api/health`)
  expect(res.headers()["x-content-type-options"]).toBe("nosniff")
  expect(res.headers()["x-frame-options"]).toBe("DENY")
  expect(res.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin"
  )
  expect(res.headers()["strict-transport-security"]).toContain(
    "max-age=31536000"
  )
  expect(res.headers()["content-security-policy"]).toBeDefined()
})

test("request ID header is set on responses", async ({ request }) => {
  const res = await request.get(`${API_URL}/api/health`)
  expect(res.headers()["x-request-id"]).toBeDefined()
})
