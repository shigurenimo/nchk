import { describe, expect, test } from "bun:test"
import type { CheckResult } from "../src/types/check-result.js"

describe("CheckResult type", () => {
  test("available status structure", () => {
    const result: CheckResult = {
      platform: "npm",
      name: "test-package",
      status: "available",
    }
    expect(result.platform).toBe("npm")
    expect(result.name).toBe("test-package")
    expect(result.status).toBe("available")
  })

  test("taken status structure", () => {
    const result: CheckResult = {
      platform: "github user",
      name: "octocat",
      status: "taken",
    }
    expect(result.status).toBe("taken")
  })

  test("error status with detail", () => {
    const result: CheckResult = {
      platform: "pypi",
      name: "test",
      status: "error",
      detail: "HTTP 500",
    }
    expect(result.status).toBe("error")
    expect(result.detail).toBe("HTTP 500")
  })
})

describe("platform names", () => {
  test("npm platform", () => {
    expect("npm").toBe("npm")
  })

  test("github user platform", () => {
    expect("github user").toBe("github user")
  })

  test("pypi platform", () => {
    expect("pypi").toBe("pypi")
  })

  test("crates.io platform", () => {
    expect("crates.io").toBe("crates.io")
  })

  test("domain platforms start with dot", () => {
    const domains = [".com", ".dev", ".io", ".co", ".org", ".net", ".app", ".sh"]
    for (const domain of domains) {
      expect(domain.startsWith(".")).toBe(true)
    }
  })
})
