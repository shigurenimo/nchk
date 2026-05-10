/**
 * Create a row widget (horizontal layout)
 */

import { normalizeColor } from "@/ui/color"
import { isOptions } from "@/ui/is-options"
import { text } from "@/ui/text"
import type { AsciiString, RowColOptionsInput, Widget } from "@/ui/types"

export function row(
  optionsOrChild?: RowColOptionsInput | Widget | AsciiString,
  ...rest: (Widget | AsciiString)[]
): Widget {
  if (optionsOrChild === undefined) {
    return { type: "row", children: [] }
  }
  if (isOptions(optionsOrChild)) {
    return {
      type: "row",
      children: rest.map((c) => (typeof c === "string" ? text(c) : c)),
      justify: optionsOrChild.justify,
      items: optionsOrChild.items,
      width: optionsOrChild.width,
      gap: optionsOrChild.gap,
      px: optionsOrChild.px,
      pl: optionsOrChild.pl,
      pr: optionsOrChild.pr,
      bg:
        optionsOrChild.bg !== undefined
          ? normalizeColor(optionsOrChild.bg)
          : undefined,
    }
  }
  const allChildren: (Widget | AsciiString)[] = [optionsOrChild, ...rest]
  return {
    type: "row",
    children: allChildren.map((c) => (typeof c === "string" ? text(c) : c)),
  }
}
