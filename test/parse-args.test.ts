import { describe, expect, test } from "bun:test"
import { parseArgs } from "../src/utils/parse-args.js"

describe("parseArgs", () => {
  test("returns null name when no arguments", () => {
    const result = parseArgs([])
    expect(result.name).toBe(null)
    expect(result.showHelp).toBe(false)
    expect(result.showVersion).toBe(false)
  })

  test("parses positional name argument", () => {
    const result = parseArgs(["myproject"])
    expect(result.name).toBe("myproject")
  })

  test("parses -h flag", () => {
    const result = parseArgs(["-h"])
    expect(result.showHelp).toBe(true)
  })

  test("parses --help flag", () => {
    const result = parseArgs(["--help"])
    expect(result.showHelp).toBe(true)
  })

  test("parses -v flag", () => {
    const result = parseArgs(["-v"])
    expect(result.showVersion).toBe(true)
  })

  test("parses --version flag", () => {
    const result = parseArgs(["--version"])
    expect(result.showVersion).toBe(true)
  })

  test("ignores flags for name", () => {
    const result = parseArgs(["-h", "myproject", "--version"])
    expect(result.name).toBe("myproject")
    expect(result.showHelp).toBe(true)
    expect(result.showVersion).toBe(true)
  })
})
