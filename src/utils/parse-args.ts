import { VERSION } from "@/version.js"

export type ParsedArgs = {
  readonly name: string | null
  readonly showHelp: boolean
  readonly showVersion: boolean
}

const HELP_TEXT = `
nchk - Allocate your next project name

Usage:
  nchk              Interactive mode (type a name)
  nchk <name>       Check availability of <name>

Options:
  -h, --help          Show this help message
  -v, --version       Show version number

Keys (interactive mode):
  type / backspace    Edit name (".xx" narrows domain TLDs)
  Up/Down, PgUp/PgDn  Move cursor
  Enter               Check selected item
  Tab                 Check all listed items
  Esc, Ctrl+C         Quit

Examples:
  nchk myproject      Check "myproject"
  nchk foo.dev        Interactive, domains filtered to .dev*
  nchk foo | cat      Non-interactive: print results and exit
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
