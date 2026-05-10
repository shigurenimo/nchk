/**
 * Calculate display width of a string, handling CJK characters and ANSI escape sequences
 */

function isFullWidth(char: string): boolean {
  const code = char.codePointAt(0)
  if (code === undefined) return false
  // CJK Unified Ideographs
  if (code >= 0x4e00 && code <= 0x9fff) return true
  // CJK Extension A
  if (code >= 0x3400 && code <= 0x4dbf) return true
  // Hiragana
  if (code >= 0x3040 && code <= 0x309f) return true
  // Katakana
  if (code >= 0x30a0 && code <= 0x30ff) return true
  // Fullwidth forms
  if (code >= 0xff00 && code <= 0xff60) return true
  // Halfwidth Katakana is NOT fullwidth
  if (code >= 0xff65 && code <= 0xff9f) return false
  // CJK Symbols and Punctuation
  if (code >= 0x3000 && code <= 0x303f) return true
  // Hangul
  if (code >= 0xac00 && code <= 0xd7af) return true
  return false
}

export function displayWidth(str: string): number {
  // Remove ANSI escape sequences: \x1b[...m
  const withoutAnsi = str.replace(/\x1b\[[0-9;]*m/g, "")
  let width = 0
  for (const char of withoutAnsi) {
    width += isFullWidth(char) ? 2 : 1
  }
  return width
}
