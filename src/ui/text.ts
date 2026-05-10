/**
 * Create a text widget
 */

import { ascii } from "@/ui/ascii"
import { normalizeColor } from "@/ui/color"
import type { TextStyle, TextStyleInput, Widget } from "@/ui/types"

function normalizeStyle(input: TextStyleInput): TextStyle {
  return {
    px: input.px,
    pl: input.pl,
    pr: input.pr,
    fg: input.fg !== undefined ? normalizeColor(input.fg) : undefined,
    bg: input.bg !== undefined ? normalizeColor(input.bg) : undefined,
  }
}

export function text(
  styleOrContent: TextStyleInput | string,
  content?: string,
): Widget {
  if (typeof styleOrContent === "string") {
    return { type: "text", content: ascii(styleOrContent), style: {} }
  }
  return {
    type: "text",
    content: ascii(content ?? ""),
    style: normalizeStyle(styleOrContent),
  }
}
