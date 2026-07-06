import { checkRegistry } from "@/checkers/check-registry.js"
import type { CheckResult } from "@/types/check-result.js"

export async function checkCrates(name: string): Promise<CheckResult> {
  return checkRegistry(
    "crates.io",
    `https://crates.io/api/v1/crates/${encodeURIComponent(name)}`,
    name,
  )
}
