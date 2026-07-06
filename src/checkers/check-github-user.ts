import { checkRegistry } from "@/checkers/check-registry.js"
import type { CheckResult } from "@/types/check-result.js"

export async function checkGithubUser(name: string): Promise<CheckResult> {
  return checkRegistry(
    "github user",
    `https://api.github.com/users/${encodeURIComponent(name)}`,
    name,
    { Accept: "application/vnd.github.v3+json" },
  )
}
