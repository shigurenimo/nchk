import { resolve } from "node:dns/promises"
import type { CheckResult } from "@/types/check-result.js"

export async function checkDomain(
  name: string,
  tld: string,
): Promise<CheckResult> {
  const domain = `${name}.${tld}`
  const platform = `.${tld}`

  try {
    await resolve(domain)
    return { platform, name: domain, status: "taken" }
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOTFOUND") {
      return { platform, name: domain, status: "available" }
    }

    const message = err instanceof Error ? err.message : String(err)
    return { platform, name: domain, status: "error", detail: message }
  }
}
