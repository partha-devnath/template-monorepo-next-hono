import { createLogger } from "@workspace/logger/browser"

const logger = createLogger("api-client")
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  cache?: RequestCache
}

export async function apiClient<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, cache } = options

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  }

  if (cache) {
    fetchOptions.cache = cache
  }

  const response = await fetch(`${API_URL}${path}`, fetchOptions)
  const data = await response.json()

  if (!response.ok) {
    const errMsg = data.error ?? `Request failed with status ${response.status}`
    logger.error({ status: response.status, path, method }, errMsg)
    throw new Error(errMsg)
  }

  return data
}
