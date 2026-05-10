/**
 * Type guard to distinguish RowColOptions from Widget
 */

import type { RowColOptionsInput } from "@/ui/types"

export function isOptions(x: unknown): x is RowColOptionsInput {
  if (typeof x !== "object" || x === null) return false
  // Exclude Widgets (they have a "type" property)
  if ("type" in x) return false
  return (
    "justify" in x ||
    "items" in x ||
    "width" in x ||
    "height" in x ||
    "gap" in x ||
    "px" in x ||
    "pl" in x ||
    "pr" in x ||
    "bg" in x
  )
}
