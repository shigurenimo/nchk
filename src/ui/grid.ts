/**
 * Create a grid widget (2D layout)
 */

import { normalizeColor } from "@/ui/color"
import { text } from "@/ui/text"
import type { AsciiString, ColorInput, GridWidget, Widget } from "@/ui/types"

export type GridOptionsInput = {
  cellWidth?: number
  cellHeight?: number
  gap?: number
  gapX?: number
  gapY?: number
  bg?: ColorInput
}

function isGridOptions(v: unknown): v is GridOptionsInput {
  if (typeof v !== "object" || v === null) return false
  const obj = v as Record<string, unknown>
  return (
    "cellWidth" in obj ||
    "cellHeight" in obj ||
    "gap" in obj ||
    "gapX" in obj ||
    "gapY" in obj ||
    ("bg" in obj && !("type" in obj))
  )
}

type GridRow = readonly (Widget | AsciiString)[]

export function grid(
  optionsOrFirstRow?: GridOptionsInput | GridRow,
  ...rows: GridRow[]
): GridWidget {
  if (optionsOrFirstRow === undefined) {
    return { type: "grid", rows: [], cellWidth: 1, cellHeight: 1 }
  }

  if (isGridOptions(optionsOrFirstRow)) {
    const opts = optionsOrFirstRow
    const normalizedRows = rows.map((row) =>
      row.map((c) => (typeof c === "string" ? text(c) : c)),
    )
    return {
      type: "grid",
      rows: normalizedRows,
      cellWidth: opts.cellWidth ?? 1,
      cellHeight: opts.cellHeight ?? 1,
      gapX: opts.gapX ?? opts.gap ?? 0,
      gapY: opts.gapY ?? opts.gap ?? 0,
      bg: opts.bg !== undefined ? normalizeColor(opts.bg) : undefined,
    }
  }

  // First arg is a row
  const allRows = [optionsOrFirstRow, ...rows]
  const normalizedRows = allRows.map((row) =>
    row.map((c) => (typeof c === "string" ? text(c) : c)),
  )
  return {
    type: "grid",
    rows: normalizedRows,
    cellWidth: 1,
    cellHeight: 1,
  }
}
