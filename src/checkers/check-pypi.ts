import type { CheckResult } from "@/types/check-result.js"
import { VERSION } from "@/version.js"

export async function checkPypi(name: string): Promise<CheckResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(
      `https://pypi.org/pypi/${encodeURIComponent(name)}/json`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": `nchk/${VERSION}`,
        },
      },
    )

    if (res.status === 404) {
      return { platform: "pypi", name, status: "available" }
    }

    if (res.ok) {
      return { platform: "pypi", name, status: "taken" }
    }

    return {
      platform: "pypi",
      name,
      status: "error",
      detail: `HTTP ${res.status}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { platform: "pypi", name, status: "error", detail: message }
  } finally {
    clearTimeout(timeout)
  }
}
