import type { CheckResult } from "@/types/check-result.js"
import { VERSION } from "@/version.js"

export async function checkCrates(name: string): Promise<CheckResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(
      `https://crates.io/api/v1/crates/${encodeURIComponent(name)}`,
      {
        signal: controller.signal,
        headers: {
          // crates.io requires User-Agent (policy compliance)
          "User-Agent": `nchk/${VERSION}`,
        },
      },
    )

    if (res.status === 404) {
      return { platform: "crates.io", name, status: "available" }
    }

    if (res.ok) {
      return { platform: "crates.io", name, status: "taken" }
    }

    return {
      platform: "crates.io",
      name,
      status: "error",
      detail: `HTTP ${res.status}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { platform: "crates.io", name, status: "error", detail: message }
  } finally {
    clearTimeout(timeout)
  }
}
