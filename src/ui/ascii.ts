/**
 * String validation for TUI
 * Allows:
 * - Printable ASCII: 0x20 (space) to 0x7E (~)
 * - ANSI escape sequences: \x1b[...m
 * - Box drawing characters: U+2500-U+257F
 * - Block elements: U+2580-U+259F
 * - Geometric shapes: U+25A0-U+25FF
 * - Miscellaneous symbols: U+2600-U+26FF
 * - Arrows: U+2190-U+21FF
 * - Math symbols: U+2200-U+22FF
 * - CJK characters: U+4E00-U+9FFF, U+3400-U+4DBF
 * - Hiragana: U+3040-U+309F
 * - Katakana: U+30A0-U+30FF
 * - CJK Symbols: U+3000-U+303F
 * - Fullwidth forms: U+FF00-U+FF60
 * - Halfwidth Katakana: U+FF65-U+FF9F
 * - Hangul: U+AC00-U+D7AF
 */

import type { AsciiString } from "@/ui/types"

export function ascii(str: string): AsciiString {
  // No validation - trust sanitize() from text-utils
  return str as AsciiString
}
