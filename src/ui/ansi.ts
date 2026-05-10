/**
 * ANSI escape sequence helpers
 */

import type { Color } from "@/ui/types"

export const ansi = {
  moveTo: (x: number, y: number) => `\x1b[${y + 1};${x + 1}H`,
  reset: "\x1b[0m",
  fg: (c: Color) =>
    c === "default" ? "\x1b[39m" : `\x1b[38;2;${c[0]};${c[1]};${c[2]}m`,
  bg: (c: Color) =>
    c === "default" ? "\x1b[49m" : `\x1b[48;2;${c[0]};${c[1]};${c[2]}m`,
} as const
