/**
 * Render a widget tree to ANSI string
 */

import { ansi } from "@/ui/ansi"
import { renderWidget } from "@/ui/render-widget"
import type { Widget } from "@/ui/types"

export function render(
  widget: Widget,
  screenX = 0,
  screenY = 0,
  maxWidth = 9999,
  maxHeight = 9999,
): string {
  const ctx = { output: "" }
  const result = renderWidget(
    widget,
    screenX,
    screenY,
    maxWidth,
    maxHeight,
    ctx,
  )
  return result.output + ansi.reset
}
