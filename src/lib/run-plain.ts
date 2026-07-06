import { checkCrates } from "@/checkers/check-crates.js"
import { checkDomain } from "@/checkers/check-domain.js"
import { checkGithubUser } from "@/checkers/check-github-user.js"
import { checkNpm } from "@/checkers/check-npm.js"
import { checkPypi } from "@/checkers/check-pypi.js"
import { setCache } from "@/lib/cache.js"
import type { CheckResult } from "@/types/check-result.js"

const DEFAULT_TLDS = ["com", "net", "org", "io", "dev", "app"]

// Non-interactive output for pipes / CI. Returns the exit code.
export async function runPlain(name: string): Promise<number> {
  const dotIndex = name.lastIndexOf(".")

  // "foo.dev" checks only that exact domain
  const checks: Promise<CheckResult>[] =
    dotIndex > 0
      ? [checkDomain(name.slice(0, dotIndex), name.slice(dotIndex + 1))]
      : [
          checkNpm(name),
          checkGithubUser(name),
          checkPypi(name),
          checkCrates(name),
          ...DEFAULT_TLDS.map((tld) => checkDomain(name, tld)),
        ]

  const results = await Promise.all(checks)

  let hasError = false
  for (const result of results) {
    setCache(result)
    const label = result.platform.startsWith(".")
      ? result.name
      : result.platform
    const detail = result.detail ? ` (${result.detail})` : ""
    console.log(`${label.padEnd(20)} ${result.status}${detail}`)
    if (result.status === "error") {
      hasError = true
    }
  }

  return hasError ? 1 : 0
}
