/**
 * Calculate the natural height of a widget
 */

import type { Widget } from "@/ui/types"

export function calcHeight(widget: Widget): number {
  if (widget.type === "text") return 1
  if (widget.type === "row") {
    return Math.max(1, ...widget.children.map(calcHeight))
  }
  if (widget.type === "col") {
    const gap = widget.gap ?? 0
    const childrenHeight = widget.children.reduce(
      (sum, c) => sum + calcHeight(c),
      0,
    )
    const totalGap = gap * Math.max(0, widget.children.length - 1)
    return widget.height ?? childrenHeight + totalGap
  }
  if (widget.type === "grid") {
    const numRows = widget.rows.length
    const gapY = widget.gapY ?? 0
    const totalGapY = gapY * Math.max(0, numRows - 1)
    return numRows * widget.cellHeight + totalGapY
  }
  if (widget.type === "canvas") {
    return widget.height
  }
  return 1
}
