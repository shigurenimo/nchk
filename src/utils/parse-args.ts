import { VERSION } from "@/version.js"

export type ParsedArgs = {
  readonly name: string | null
  readonly showHelp: boolean
  readonly showVersion: boolean
}

const HELP_TEXT = `
nchk - Allocate your next project name

Usage:
  nchk              Interactive mode (prompt for name)
  nchk <name>       Check availability of <name>

Options:
  -h, --help          Show this help message
  -v, --version       Show version number

Examples:
  nchk              Start interactive mode
  nchk myproject    Check "myproject"
`.trim()

export function parseArgs(args: string[]): ParsedArgs {
  const showHelp = args.includes("-h") || args.includes("--help")
  const showVersion = args.includes("-v") || args.includes("--version")

  const positional = args.filter((arg) => !arg.startsWith("-"))
  const name = positional[0] ?? null

  return { name, showHelp, showVersion }
}

export function printHelp(): void {
  console.log(HELP_TEXT)
}

export function printVersion(): void {
  console.log(`nchk v${VERSION}`)
}
