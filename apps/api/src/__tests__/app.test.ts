import { describe, it, expect, beforeAll, mock } from "bun:test"

const mockDb = {
  execute: async () => [{ "?column?": 1 }],
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve([]),
      }),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve(),
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([]),
    }),
  }),
}

mock.module("@workspace/db", () => ({
  db: mockDb,
  closeDb: async () => {},
}))

let app: Awaited<ReturnType<() => Promise<typeof import("../app")>>>["default"]

beforeAll(async () => {
  process.env.DATABASE_URL = "postgres://mock:mock@localhost:5432/test"
  const mod = await import("../app")
  app = mod.default
})

describe("app", () => {
  it("health endpoint returns ok", async () => {
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
    const res = await app.request("/api/protected")
    expect(res.status).toBe(401)
  })
})
