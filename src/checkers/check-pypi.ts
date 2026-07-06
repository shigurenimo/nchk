import { checkRegistry } from "@/checkers/check-registry.js"
import type { CheckResult } from "@/types/check-result.js"

export async function checkPypi(name: string): Promise<CheckResult> {
  return checkRegistry(
    "pypi",
    `https://pypi.org/pypi/${encodeURIComponent(name)}/json`,
    name,
  )
}
