import { checkRegistry } from "@/checkers/check-registry.js"
import type { CheckResult } from "@/types/check-result.js"

export async function checkNpm(name: string): Promise<CheckResult> {
  return checkRegistry(
    "npm",
    `https://registry.npmjs.org/${encodeURIComponent(name)}`,
    name,
  )
}
