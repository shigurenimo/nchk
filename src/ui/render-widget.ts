/**
 * Internal recursive widget renderer
 */

import { ansi } from "@/ui/ansi"
import { calcHeight } from "@/ui/calc-height"
import { calcWidth } from "@/ui/calc-width"
import { displayWidth } from "@/ui/display-width"
import { HasciiUiOverflowError } from "@/ui/errors"
import { paletteToRgb } from "@/ui/palette"
import type { Widget } from "@/ui/types"

export type RenderContext = {
  output: string
}

export function renderWidget(
  widget: Widget,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
  ctx: RenderContext,
): RenderContext {
  // Skip if no space available
  if (maxWidth <= 0 || maxHeight <= 0) return ctx

  if (widget.type === "text") {
    const px = widget.style.px ?? 0
    const pl = widget.style.pl ?? px
    const pr = widget.style.pr ?? px

    // Calculate available space for content
    const availableForPadding = Math.min(pl + pr, maxWidth)
    const actualPl = Math.min(pl, availableForPadding)
    const actualPr = Math.min(pr, Math.max(0, availableForPadding - actualPl))
    const availableForContent = Math.max(0, maxWidth - actualPl - actualPr)

    // Throw error if content overflows
    const contentLength = displayWidth(widget.content)
    if (contentLength > availableForContent) {
      throw new HasciiUiOverflowError(
        widget.content,
        availableForContent,
        contentLength,
      )
    }

    // bg undefined = transparent (inherit parent's bg)
    if (widget.style.bg) {
      ctx.output += ansi.bg(widget.style.bg)
    }
    if (widget.style.fg) {
      ctx.output += ansi.fg(widget.style.fg)
    }
    ctx.output += ansi.moveTo(x, y)
    ctx.output += " ".repeat(actualPl) + widget.content + " ".repeat(actualPr)
    return ctx
  }

  if (widget.type === "row") {
    const rowWidth = Math.min(widget.width ?? calcWidth(widget), maxWidth)
    const rowHeight = Math.min(calcHeight(widget), maxHeight)

    // Fill background if specified
    if (widget.bg) {
      ctx.output += ansi.bg(widget.bg)
      const emptyLine = " ".repeat(rowWidth)
      for (let row = 0; row < rowHeight; row++) {
        ctx.output += ansi.moveTo(x, y + row) + emptyLine
      }
    }

    // Calculate padding
    const px = widget.px ?? 0
    const pl = widget.pl ?? px
    const pr = widget.pr ?? px
    const contentWidth = rowWidth - pl - pr

    const gap = widget.gap ?? 0
    const childrenWidth = widget.children.reduce(
      (sum, c) => sum + calcWidth(c),
      0,
    )
    const totalGap = gap * Math.max(0, widget.children.length - 1)
    const totalWidth = childrenWidth + totalGap

    // Calculate start x and gap based on justify (main axis)
    let startX = x + pl
    let actualGap = gap
    if (widget.justify === "center") {
      startX = x + pl + Math.floor((contentWidth - totalWidth) / 2)
    } else if (widget.justify === "end") {
      startX = x + pl + (contentWidth - totalWidth)
    } else if (
      widget.justify === "space-between" &&
      widget.children.length > 1
    ) {
      const extraSpace = contentWidth - childrenWidth
      actualGap = Math.floor(extraSpace / (widget.children.length - 1))
    }

    let cx = startX
    let remainingWidth = contentWidth
    for (let i = 0; i < widget.children.length; i++) {
      const child = widget.children[i]
      if (child) {
        const childNaturalWidth = calcWidth(child)
        const childNaturalHeight = calcHeight(child)
        const childMaxWidth = Math.min(childNaturalWidth, remainingWidth)

        // Calculate y based on items (cross axis - vertical)
        let cy = y
        if (widget.items === "center") {
          cy = y + Math.floor((rowHeight - childNaturalHeight) / 2)
        } else if (widget.items === "end") {
          cy = y + (rowHeight - childNaturalHeight)
        }

        ctx = renderWidget(child, cx, cy, childMaxWidth, rowHeight, ctx)
        cx += childMaxWidth
        remainingWidth -= childMaxWidth
      }
      if (i < widget.children.length - 1) {
        cx += actualGap
        remainingWidth -= actualGap
      }
      if (remainingWidth <= 0) break
    }
    return ctx
  }

  if (widget.type === "col") {
    const colWidth = Math.min(widget.width ?? calcWidth(widget), maxWidth)
    const colHeight = Math.min(widget.height ?? calcHeight(widget), maxHeight)

    // Fill background if specified
    if (widget.bg) {
      ctx.output += ansi.bg(widget.bg)
      const emptyLine = " ".repeat(colWidth)
      for (let row = 0; row < colHeight; row++) {
        ctx.output += ansi.moveTo(x, y + row) + emptyLine
      }
    }

    // Calculate padding
    const px = widget.px ?? 0
    const pl = widget.pl ?? px
    const pr = widget.pr ?? px
    const contentWidth = colWidth - pl - pr

    const gap = widget.gap ?? 0
    const childrenHeight = widget.children.reduce(
      (sum, c) => sum + calcHeight(c),
      0,
    )
    const totalGap = gap * Math.max(0, widget.children.length - 1)
    const totalHeight = childrenHeight + totalGap

    // Calculate start y and gap based on justify (main axis - vertical)
    let startY = y
    let actualGap = gap
    if (widget.justify === "space-between" && widget.children.length > 1) {
      const extraSpace = colHeight - childrenHeight
      actualGap = Math.floor(extraSpace / (widget.children.length - 1))
    } else if (widget.justify === "center" && totalHeight < colHeight) {
      startY = y + Math.floor((colHeight - totalHeight) / 2)
    } else if (widget.justify === "end" && totalHeight < colHeight) {
      startY = y + (colHeight - totalHeight)
    }

    let cy = startY
    let remainingHeight = colHeight
    for (let i = 0; i < widget.children.length; i++) {
      const child = widget.children[i]
      if (child) {
        const childNaturalHeight = calcHeight(child)
        const childMaxHeight = Math.min(childNaturalHeight, remainingHeight)
        const childWidth = calcWidth(child)

        // Calculate x based on items (cross axis - horizontal) with padding
        let cx = x + pl
        if (widget.items === "center") {
          cx = x + pl + Math.floor((contentWidth - childWidth) / 2)
        } else if (widget.items === "end") {
          cx = x + pl + (contentWidth - childWidth)
        }

        ctx = renderWidget(child, cx, cy, contentWidth, childMaxHeight, ctx)
        cy += childMaxHeight
        remainingHeight -= childMaxHeight
      }
      if (i < widget.children.length - 1) {
        cy += actualGap
        remainingHeight -= actualGap
      }
      if (remainingHeight <= 0) break
    }
    return ctx
  }

  if (widget.type === "grid") {
    const gridWidth = calcWidth(widget)
    const gridHeight = calcHeight(widget)
    const gapX = widget.gapX ?? 0
    const gapY = widget.gapY ?? 0

    // Fill background if specified
    if (widget.bg) {
      ctx.output += ansi.bg(widget.bg)
      const emptyLine = " ".repeat(gridWidth)
      for (let row = 0; row < gridHeight; row++) {
        ctx.output += ansi.moveTo(x, y + row) + emptyLine
      }
    }

    // Render each cell
    for (let rowIdx = 0; rowIdx < widget.rows.length; rowIdx++) {
      const row = widget.rows[rowIdx]
      if (!row) continue
      const cellY = y + rowIdx * (widget.cellHeight + gapY)

      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cell = row[colIdx]
        if (!cell) continue
        const cellX = x + colIdx * (widget.cellWidth + gapX)

        ctx = renderWidget(
          cell,
          cellX,
          cellY,
          widget.cellWidth,
          widget.cellHeight,
          ctx,
        )
      }
    }
    return ctx
  }

  if (widget.type === "canvas") {
    const canvasWidth = Math.min(widget.width, maxWidth)
    const canvasHeight = Math.min(widget.height, maxHeight)

    for (let row = 0; row < canvasHeight; row++) {
      const bufferRow = widget.buffer[row]
      if (!bufferRow) continue

      ctx.output += ansi.moveTo(x, y + row)

      for (let col = 0; col < canvasWidth; col++) {
        const cell = bufferRow[col]
        if (!cell) {
          ctx.output += " "
          continue
        }

        const fgRgb = paletteToRgb(cell.fg)
        ctx.output += ansi.fg(fgRgb)

        if (cell.bg !== null) {
          const bgRgb = paletteToRgb(cell.bg)
          ctx.output += ansi.bg(bgRgb)
        }

        ctx.output += cell.char
      }
    }
    return ctx
  }

  return ctx
}
