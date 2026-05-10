import type { CheckResult } from "@/types/check-result.js"
import { VERSION } from "@/version.js"

export async function checkNpm(name: string): Promise<CheckResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(name)}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": `nchk/${VERSION}`,
        },
      },
    )

    if (res.status === 404) {
      return { platform: "npm", name, status: "available" }
    }

    if (res.ok) {
      return { platform: "npm", name, status: "taken" }
    }

    return {
      platform: "npm",
      name,
      status: "error",
      detail: `HTTP ${res.status}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { platform: "npm", name, status: "error", detail: message }
  } finally {
    clearTimeout(timeout)
  }
}
