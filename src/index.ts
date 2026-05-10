import { checkCrates } from "@/checkers/check-crates.js"
import { checkDomain } from "@/checkers/check-domain.js"
import { checkGithubUser } from "@/checkers/check-github-user.js"
import { checkNpm } from "@/checkers/check-npm.js"
import { checkPypi } from "@/checkers/check-pypi.js"
import { CLOUDFLARE_TLDS } from "@/data/cloudflare-tlds.js"
import { cleanupOldEntriesAsync } from "@/lib/cache.js"
import type { ItemTemplate } from "@/ui/interactive.js"
import { runInteractive } from "@/ui/interactive.js"
import { parseArgs, printHelp, printVersion } from "@/utils/parse-args.js"

// Start async cache cleanup (non-blocking)
cleanupOldEntriesAsync()

const args = parseArgs(process.argv.slice(2))

if (args.showHelp) {
  printHelp()
  process.exit(0)
}

if (args.showVersion) {
  printVersion()
  process.exit(0)
}

const name = args.name ?? ""

const templates: ItemTemplate[] = [
  {
    label: "npm",
    platform: "npm",
    createCheck: (n) => () => checkNpm(n),
    getName: (n) => n,
  },
  {
    label: "GitHub User",
    platform: "github user",
    createCheck: (n) => () => checkGithubUser(n),
    getName: (n) => n,
  },
  {
    label: "PyPI",
    platform: "pypi",
    createCheck: (n) => () => checkPypi(n),
    getName: (n) => n,
  },
  {
    label: "crates.io",
    platform: "crates.io",
    createCheck: (n) => () => checkCrates(n),
    getName: (n) => n,
  },
  ...CLOUDFLARE_TLDS.map((tld) => ({
    label: `*.${tld}`,
    platform: `.${tld}`,
    createCheck: (n: string) => () => checkDomain(n, tld),
    getName: (n: string) => `${n}.${tld}`,
    getLabel: (n: string) => `${n}.${tld}`,
  })),
]

await runInteractive(name, templates)
