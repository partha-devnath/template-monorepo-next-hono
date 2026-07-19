import { describe, it, expect } from "bun:test"

describe("app", () => {
  it("health endpoint returns ok", async () => {
    const appModule = await import("../app")
    const app = appModule.default
    const res = await app.request("/api/health")
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      success: boolean
      data: { status: string }
    }
    expect(body.success).toBe(true)
    expect(body.data.status).toBe("ok")
  })

  it("protected endpoint returns 401 without session", async () => {
    const appModule = await import("../app")
    const app = appModule.default
    const res = await app.request("/api/protected")
    expect(res.status).toBe(401)
  })
})
