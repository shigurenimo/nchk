/**
 * 16-color palette for Canvas Widget
 * Shared with runtime for consistency
 */

import type { RGB } from "@/ui/types"

export const PALETTE: readonly RGB[] = Object.freeze([
  [0, 0, 0], // 0: black
  [128, 0, 0], // 1: dark red
  [0, 128, 0], // 2: dark green
  [128, 128, 0], // 3: dark yellow
  [0, 0, 128], // 4: dark blue
  [128, 0, 128], // 5: dark magenta
  [0, 128, 128], // 6: dark cyan
  [192, 192, 192], // 7: light gray
  [128, 128, 128], // 8: dark gray
  [255, 0, 0], // 9: red
  [0, 255, 0], // 10: green
  [255, 255, 0], // 11: yellow
  [0, 0, 255], // 12: blue
  [255, 0, 255], // 13: magenta
  [0, 255, 255], // 14: cyan
  [255, 255, 255], // 15: white
])

export function paletteToRgb(index: number): RGB {
  return PALETTE[index % PALETTE.length] ?? [0, 0, 0]
}
