import { resolveNs } from "node:dns/promises"
import type { CheckResult } from "@/types/check-result.js"

// NS lookup instead of A: registered-but-parked domains keep NS delegation
// even when no A record exists
export async function checkDomain(
  name: string,
  tld: string,
): Promise<CheckResult> {
  const domain = `${name}.${tld}`
  const platform = `.${tld}`

  try {
    await resolveNs(domain)
    return { platform, name: domain, status: "taken" }
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === "ENOTFOUND") {
        return { platform, name: domain, status: "available" }
      }
      // Name exists but no NS records at this node = registered
      if (err.code === "ENODATA") {
        return { platform, name: domain, status: "taken" }
      }
    }

    const message = err instanceof Error ? err.message : String(err)
    return { platform, name: domain, status: "error", detail: message }
  }
}
