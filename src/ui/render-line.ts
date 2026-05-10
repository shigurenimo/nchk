/**
 * Simple line renderer without absolute positioning
 * Renders a widget to a single line ANSI string
 */

import { ansi } from "@/ui/ansi"
import type { Widget } from "@/ui/types"

export function renderLine(widget: Widget): string {
  if (widget.type === "text") {
    let output = ""
    const pl = widget.style.pl ?? widget.style.px ?? 0
    const pr = widget.style.pr ?? widget.style.px ?? 0

    if (widget.style.bg) {
      output += ansi.bg(widget.style.bg)
    }
    if (widget.style.fg) {
      output += ansi.fg(widget.style.fg)
    }

    output += " ".repeat(pl) + widget.content + " ".repeat(pr)
    output += ansi.reset

    return output
  }

  if (widget.type === "row") {
    let output = ""
    const gap = widget.gap ?? 0
    const gapStr = " ".repeat(gap)

    // Apply row background to gaps
    let gapWithBg = gapStr
    if (widget.bg) {
      gapWithBg = ansi.bg(widget.bg) + gapStr + ansi.reset
    }

    for (let i = 0; i < widget.children.length; i++) {
      const child = widget.children[i]
      if (child) {
        output += renderLine(child)
      }
      if (i < widget.children.length - 1) {
        output += gapWithBg
      }
    }

    return output
  }

  return ""
}
