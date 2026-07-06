import type { CheckResult } from "@/types/check-result.js"
import { VERSION } from "@/version.js"

// 404 = available, 2xx = taken. Shared by all HTTP registry checkers.
export async function checkRegistry(
  platform: string,
  url: string,
  name: string,
  headers: Record<string, string> = {},
): Promise<CheckResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": `nchk/${VERSION}`,
        ...headers,
      },
    })

    if (res.status === 404) {
      return { platform, name, status: "available" }
    }

    if (res.ok) {
      return { platform, name, status: "taken" }
    }

    return {
      platform,
      name,
      status: "error",
      detail: `HTTP ${res.status}`,
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { platform, name, status: "error", detail: "timeout" }
    }
    const message = err instanceof Error ? err.message : String(err)
    return { platform, name, status: "error", detail: message }
  } finally {
    clearTimeout(timeout)
  }
}
