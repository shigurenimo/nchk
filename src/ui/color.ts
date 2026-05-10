/**
 * Color normalization utilities
 */

import { HasciiUiInvalidColorError } from "@/ui/errors"
import type { Color, ColorInput, RGB } from "@/ui/types"

const NAMED_COLORS: Record<string, RGB> = {
  // Basic colors
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],

  // Grays
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  darkgray: [64, 64, 64],
  darkgrey: [64, 64, 64],
  lightgray: [192, 192, 192],
  lightgrey: [192, 192, 192],

  // Extended colors
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  purple: [128, 0, 128],
  brown: [139, 69, 19],
  lime: [0, 255, 0],
  navy: [0, 0, 128],
  teal: [0, 128, 128],
  olive: [128, 128, 0],
  maroon: [128, 0, 0],
  aqua: [0, 255, 255],
  silver: [192, 192, 192],
  gold: [255, 215, 0],
} as const

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

function parseHex(hex: string): RGB {
  const match = HEX_PATTERN.exec(hex)
  if (!match || !match[1]) {
    throw new HasciiUiInvalidColorError(hex)
  }

  let hexValue = match[1]

  // Expand shorthand (#abc -> #aabbcc)
  if (hexValue.length === 3) {
    hexValue = hexValue
      .split("")
      .map((c) => c + c)
      .join("")
  }

  const r = Number.parseInt(hexValue.slice(0, 2), 16)
  const g = Number.parseInt(hexValue.slice(2, 4), 16)
  const b = Number.parseInt(hexValue.slice(4, 6), 16)

  return [r, g, b] as const
}

function isRGB(value: unknown): value is RGB {
  if (!Array.isArray(value) || value.length !== 3) return false
  return value.every(
    (n) => typeof n === "number" && n >= 0 && n <= 255 && Number.isInteger(n),
  )
}

export function normalizeColor(input: ColorInput): Color {
  if (input === "default") {
    return "default"
  }

  if (isRGB(input)) {
    return input
  }

  if (typeof input === "string") {
    // Check hex format
    if (input.startsWith("#")) {
      return parseHex(input)
    }

    // Check named color
    const lower = input.toLowerCase()
    const named = NAMED_COLORS[lower]
    if (named) {
      return named
    }
  }

  throw new HasciiUiInvalidColorError(input)
}
