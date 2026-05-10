/**
 * Create a col widget (vertical layout)
 */

import { normalizeColor } from "@/ui/color"
import { isOptions } from "@/ui/is-options"
import { text } from "@/ui/text"
import type { AsciiString, RowColOptionsInput, Widget } from "@/ui/types"

export function col(
  optionsOrChild?: RowColOptionsInput | Widget | AsciiString,
  ...rest: (Widget | AsciiString)[]
): Widget {
  if (optionsOrChild === undefined) {
    return { type: "col", children: [] }
  }
  if (isOptions(optionsOrChild)) {
    return {
      type: "col",
      children: rest.map((c) => (typeof c === "string" ? text(c) : c)),
      justify: optionsOrChild.justify,
      items: optionsOrChild.items,
      width: optionsOrChild.width,
      height: optionsOrChild.height,
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
    type: "col",
    children: allChildren.map((c) => (typeof c === "string" ? text(c) : c)),
  }
}
