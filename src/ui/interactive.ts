// Interactive UI for nchk

import { getCached, setCache } from "@/lib/cache.js"
import {
  disableRawMode,
  enableRawMode,
  hideCursor,
  onKeypress,
  showCursor,
} from "@/lib/terminal.js"
import type { CheckResult, CheckStatus } from "@/types/check-result.js"
import { renderLine } from "@/ui/render-line.js"
import { row } from "@/ui/row.js"
import { text } from "@/ui/text.js"
import type { ColorInput } from "@/ui/types.js"

type CheckFn = () => Promise<CheckResult>

export type ListItem = {
  label: string
  platform: string
  name: string
  check: CheckFn
  status: CheckStatus | "pending" | "checking"
  detail?: string
  checkedAt?: number
}

export type ItemTemplate = {
  label: string
  platform: string
  createCheck: (name: string) => CheckFn
  getName: (name: string) => string
  getLabel?: (name: string) => string
}

const VIEW_HEIGHT = 16

// Colors
const colors = {
  white: [255, 255, 255] as ColorInput,
  gray: [128, 128, 128] as ColorInput,
  bgBlue: [30, 60, 100] as ColorInput,
  bgOk: [0, 140, 0] as ColorInput,
  bgTaken: [180, 50, 50] as ColorInput,
  bgChecking: [180, 140, 0] as ColorInput,
  bgError: [180, 100, 0] as ColorInput,
}

// Column widths
const COL_LABEL = 16
const COL_STATUS = 5
const COL_DATE = 10

function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "now"
}

export async function runInteractive(
  projectName: string,
  templates: ItemTemplate[],
): Promise<void> {
  let cursor = 0
  let scrollOffset = 0
  let running = true
  let currentName = projectName
  let lastLineCount = 0
  const checkingSet = new Set<string>()

  function createItems(name: string): ListItem[] {
    // Empty name: show empty table
    if (name === "") {
      return []
    }

    // Check if name contains a dot (domain filter mode)
    const dotIndex = name.lastIndexOf(".")
    const hasDot = dotIndex >= 0

    let baseName = name
    let tldFilter = ""

    if (hasDot) {
      baseName = name.slice(0, dotIndex)
      tldFilter = name.slice(dotIndex + 1).toLowerCase()
    }

    // Filter templates: non-domain items always shown, domains filtered by prefix
    const filteredTemplates = templates.filter((t) => {
      if (!t.platform.startsWith(".")) {
        // Non-domain: always show
        return true
      }
      if (!hasDot) {
        // No dot: show all domains
        return true
      }
      // Domain: prefix match (e.g., ".c" matches ".com", ".co")
      const tld = t.platform.slice(1) // remove leading dot
      return tld.startsWith(tldFilter)
    })

    return filteredTemplates.map((template) => {
      const itemName = template.getName(baseName)
      const cached = getCached(template.platform, itemName)
      const isChecking = checkingSet.has(`${template.platform}:${itemName}`)
      return {
        label: template.getLabel ? template.getLabel(baseName) : template.label,
        platform: template.platform,
        name: itemName,
        check: template.createCheck(baseName),
        status: isChecking ? "checking" : (cached?.result.status ?? "pending"),
        detail: cached?.result.detail,
        checkedAt: cached?.timestamp,
      }
    })
  }

  function getDisplayItems(): ListItem[] {
    return createItems(currentName)
  }

  function getDisplayName(): string {
    // Show the full input including TLD if present
    return currentName
  }

  function getStatusBg(
    status: CheckStatus | "pending" | "checking",
  ): ColorInput | undefined {
    if (status === "available") return colors.bgOk
    if (status === "taken") return colors.bgTaken
    if (status === "checking") return colors.bgChecking
    if (status === "error") return colors.bgError
    return undefined
  }

  function getStatusText(status: CheckStatus | "pending" | "checking"): string {
    if (status === "pending") return "-"
    if (status === "checking") return "..."
    if (status === "available") return "OK"
    if (status === "taken") return "taken"
    if (status === "error") return "error"
    return "-"
  }

  function buildLines(): string[] {
    const items = getDisplayItems()
    const lines: string[] = []
    const displayName = getDisplayName()

    // Title
    const titleWidget = row(
      text({ fg: colors.gray, pl: 1 }, "Is "),
      text({ fg: colors.white }, `'${displayName}'`),
      text({ fg: colors.gray }, " available?"),
    )
    lines.push(renderLine(titleWidget))

    // Help
    lines.push(
      renderLine(
        text(
          { fg: colors.gray, pl: 1 },
          "Up/Down scroll  Enter check  Esc quit",
        ),
      ),
    )

    // Calculate visible range
    const visibleItems = items.slice(scrollOffset, scrollOffset + VIEW_HEIGHT)

    for (let i = 0; i < VIEW_HEIGHT; i++) {
      const item = visibleItems[i]
      if (!item) {
        lines.push("")
        continue
      }

      const globalIndex = scrollOffset + i
      const isCurrent = globalIndex === cursor
      const bg = isCurrent ? colors.bgBlue : undefined
      const labelWidget = text(
        { fg: colors.white, bg, px: 1 },
        item.label.padEnd(COL_LABEL),
      )
      const statusBg = getStatusBg(item.status) ?? bg
      const statusWidget = text(
        { fg: colors.white, bg: statusBg, px: 1 },
        getStatusText(item.status).padEnd(COL_STATUS),
      )
      const dateText = item.checkedAt
        ? formatRelativeTime(item.checkedAt).padEnd(COL_DATE)
        : " ".repeat(COL_DATE)
      const dateWidget = text(
        { fg: isCurrent ? colors.white : colors.gray, bg, px: 1 },
        dateText,
      )

      const rowWidget = row(
        { gap: 2, bg },
        labelWidget,
        statusWidget,
        dateWidget,
      )
      lines.push(renderLine(rowWidget))
    }

    // Show scroll indicator
    if (items.length > VIEW_HEIGHT) {
      const pos = Math.round(
        (scrollOffset / (items.length - VIEW_HEIGHT)) * 100,
      )
      lines.push(
        renderLine(
          text(
            { fg: colors.gray },
            `  ${scrollOffset + 1}-${Math.min(scrollOffset + VIEW_HEIGHT, items.length)}/${items.length} (${pos}%)`,
          ),
        ),
      )
    }

    return lines
  }

  function renderUI(): void {
    const lines = buildLines()

    // Move cursor up to overwrite previous output
    if (lastLineCount > 0) {
      process.stdout.write(`\x1b[${lastLineCount}A`)
    }

    // Clear and write each line
    for (const line of lines) {
      process.stdout.write(`\x1b[2K${line}\n`)
    }

    lastLineCount = lines.length
  }

  function adjustScroll(): void {
    const items = getDisplayItems()
    // Keep cursor in bounds
    if (cursor >= items.length) {
      cursor = Math.max(0, items.length - 1)
    }
    // Adjust scroll to keep cursor visible
    if (cursor < scrollOffset) {
      scrollOffset = cursor
    }
    if (cursor >= scrollOffset + VIEW_HEIGHT) {
      scrollOffset = cursor - VIEW_HEIGHT + 1
    }
  }

  async function checkCurrent(): Promise<void> {
    const items = getDisplayItems()
    if (items.length === 0) return

    const item = items[cursor]
    const checkKey = `${item.platform}:${item.name}`
    if (checkingSet.has(checkKey)) return

    checkingSet.add(checkKey)
    renderUI()

    const result = await item.check()
    checkingSet.delete(checkKey)
    setCache(result)
    renderUI()
  }

  function handleKey(key: {
    name: string
    ctrl: boolean
    sequence?: string
  }): void {
    if (key.ctrl && key.name === "c") {
      cleanup()
      process.exit(0)
    }

    // Backspace - delete last character
    if (key.name === "backspace") {
      if (currentName.length > 0) {
        currentName = currentName.slice(0, -1)
        adjustScroll()
        renderUI()
      }
      return
    }

    // Escape - quit
    if (key.name === "escape") {
      cleanup()
      running = false
      return
    }

    // Navigation
    const items = getDisplayItems()

    if (key.name === "up") {
      if (items.length > 0) {
        cursor = Math.max(0, cursor - 1)
        adjustScroll()
        renderUI()
      }
      return
    }

    if (key.name === "down") {
      if (items.length > 0) {
        cursor = Math.min(items.length - 1, cursor + 1)
        adjustScroll()
        renderUI()
      }
      return
    }

    // Enter - check current item
    if (key.name === "return") {
      checkCurrent()
      return
    }

    // Type to edit name
    if (
      key.sequence &&
      key.sequence.length === 1 &&
      key.sequence >= " " &&
      key.sequence <= "~"
    ) {
      currentName += key.sequence
      adjustScroll()
      renderUI()
    }
  }

  function cleanup(): void {
    // Clear output
    if (lastLineCount > 0) {
      process.stdout.write(`\x1b[${lastLineCount}A`)
      for (let i = 0; i < lastLineCount; i++) {
        process.stdout.write("\x1b[2K\n")
      }
      process.stdout.write(`\x1b[${lastLineCount}A`)
    }
    showCursor()
    disableRawMode()
  }

  // Setup
  hideCursor()
  enableRawMode()
  renderUI()

  // Handle exit
  process.on("exit", cleanup)
  process.on("SIGINT", () => {
    cleanup()
    process.exit(0)
  })

  // Key handling
  return new Promise<void>((resolve) => {
    onKeypress((key) => {
      handleKey(key)
      if (!running) {
        resolve()
      }
    })
  })
}
