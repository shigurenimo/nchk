import { displayWidth } from "@/ui/display-width"
import type { Widget } from "@/ui/types"

/**
 * Calculate the natural width of a widget
 */
export function calcWidth(widget: Widget): number {
  if (widget.type === "text") {
    const px = widget.style.px ?? 0
    const pl = widget.style.pl ?? px
    const pr = widget.style.pr ?? px
    return pl + displayWidth(widget.content) + pr
  }

  if (widget.type === "row") {
    const px = widget.px ?? 0
    const pl = widget.pl ?? px
    const pr = widget.pr ?? px
    const gap = widget.gap ?? 0
    const childrenWidth = widget.children.reduce(
      (sum, c) => sum + calcWidth(c),
      0,
    )
    const totalGap = gap * Math.max(0, widget.children.length - 1)
    return widget.width ?? pl + childrenWidth + totalGap + pr
  }

  if (widget.type === "col") {
    const px = widget.px ?? 0
    const pl = widget.pl ?? px
    const pr = widget.pr ?? px
    const childMaxWidth = Math.max(0, ...widget.children.map(calcWidth))
    return widget.width ?? pl + childMaxWidth + pr
  }

  if (widget.type === "grid") {
    const numCols = Math.max(0, ...widget.rows.map((r) => r.length))
    const gapX = widget.gapX ?? 0
    const totalGapX = gapX * Math.max(0, numCols - 1)
    return numCols * widget.cellWidth + totalGapX
  }

  if (widget.type === "canvas") {
    return widget.width
  }

  return 0
}
