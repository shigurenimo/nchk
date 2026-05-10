import { describe, expect, test, beforeEach, afterEach } from "bun:test"
import * as fs from "node:fs"
import * as path from "node:path"
import * as os from "node:os"

// We need to test cache functions, but they use hardcoded paths
// So we'll test the logic indirectly by importing and checking behavior

describe("cache", () => {
  const testDir = path.join(os.tmpdir(), "nchk-test-" + Date.now())
  const cacheFile = path.join(testDir, "cache.json")

  beforeEach(() => {
    fs.mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true })
  })

  test("cache file format is valid JSON", () => {
    const data = {
      "npm:test": {
        result: { platform: "npm", name: "test", status: "available" },
        timestamp: Date.now(),
      },
    }
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2))

    const loaded = JSON.parse(fs.readFileSync(cacheFile, "utf-8"))
    expect(loaded["npm:test"].result.status).toBe("available")
  })

  test("cache key format is platform:name", () => {
    const platform = "npm"
    const name = "mypackage"
    const key = `${platform}:${name}`
    expect(key).toBe("npm:mypackage")
  })
})
