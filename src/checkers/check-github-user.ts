import type { CheckResult } from "@/types/check-result.js"
import { VERSION } from "@/version.js"

export async function checkGithubUser(name: string): Promise<CheckResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(name)}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": `nchk/${VERSION}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (res.status === 404) {
      return { platform: "github user", name, status: "available" }
    }

    if (res.ok) {
      return { platform: "github user", name, status: "taken" }
    }

    return {
      platform: "github user",
      name,
      status: "error",
      detail: `HTTP ${res.status}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { platform: "github user", name, status: "error", detail: message }
  } finally {
    clearTimeout(timeout)
  }
}
