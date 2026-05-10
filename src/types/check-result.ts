export type CheckStatus = "available" | "taken" | "error"

export type CheckResult = {
  readonly platform: string
  readonly name: string
  readonly status: CheckStatus
  readonly detail?: string
}
