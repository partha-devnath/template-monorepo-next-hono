import { test, expect } from "@playwright/test"

const API_URL = process.env.E2E_API_URL ?? "http://localhost:3001"

test("auth endpoints are rate limited at 30 requests per minute", async ({
  request,
}) => {
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
