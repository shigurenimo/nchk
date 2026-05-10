/**
 * Core types for open-tui
 */

// === ASCII String (Branded Type) ===

declare const ASCII_BRAND: unique symbol
export type AsciiString = string & { readonly [ASCII_BRAND]: true }

// === Color Types ===

export type RGB = readonly [number, number, number]

// Normalized internal color (after parsing)
export type Color = RGB | "default"

// Named colors supported by the library
export type NamedColor =
  | "black"
  | "white"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "cyan"
  | "magenta"
  | "gray"
  | "grey"
  | "darkgray"
  | "darkgrey"
  | "lightgray"
  | "lightgrey"
  | "orange"
  | "pink"
  | "purple"
  | "brown"
  | "lime"
  | "navy"
  | "teal"
  | "olive"
  | "maroon"
  | "aqua"
  | "silver"
  | "gold"

// User input color (accepts multiple formats)
export type ColorInput = RGB | `#${string}` | NamedColor | "default"

// === Layout Types ===

export type Justify = "start" | "center" | "end" | "space-between"

export type Items = "start" | "center" | "end"

// User-facing style input (accepts ColorInput)
export type TextStyleInput = {
  readonly px?: number
  readonly pl?: number
  readonly pr?: number
  readonly fg?: ColorInput
  readonly bg?: ColorInput
}

// Normalized internal style (uses Color)
export type TextStyle = {
  readonly px?: number
  readonly pl?: number
  readonly pr?: number
  readonly fg?: Color
  readonly bg?: Color
}

// User-facing options input (accepts ColorInput)
export type RowColOptionsInput = {
  readonly justify?: Justify
  readonly items?: Items
  readonly width?: number
  readonly height?: number
  readonly gap?: number
  readonly px?: number
  readonly pl?: number
  readonly pr?: number
  readonly bg?: ColorInput
}

// Normalized internal options (uses Color)
export type RowColOptions = {
  readonly justify?: Justify
  readonly items?: Items
  readonly width?: number
  readonly height?: number
  readonly gap?: number
  readonly px?: number
  readonly pl?: number
  readonly pr?: number
  readonly bg?: Color
}

// === Widget Types ===

export type TextWidget = {
  readonly type: "text"
  readonly content: string
  readonly style: TextStyle
}

export type RowWidget = {
  readonly type: "row"
  readonly children: readonly Widget[]
  readonly justify?: Justify
  readonly items?: Items
  readonly width?: number
  readonly gap?: number
  readonly px?: number
  readonly pl?: number
  readonly pr?: number
  readonly bg?: Color
}

export type ColWidget = {
  readonly type: "col"
  readonly children: readonly Widget[]
  readonly justify?: Justify
  readonly items?: Items
  readonly width?: number
  readonly height?: number
  readonly gap?: number
  readonly px?: number
  readonly pl?: number
  readonly pr?: number
  readonly bg?: Color
}

export type GridWidget = {
  readonly type: "grid"
  readonly rows: readonly (readonly Widget[])[]
  readonly cellWidth: number
  readonly cellHeight: number
  readonly gapX?: number
  readonly gapY?: number
  readonly bg?: Color
}

// === Canvas Types (for runtime Buffer integration) ===

export type CanvasCell = {
  readonly char: string
  readonly fg: number // Palette index (0-15)
  readonly bg: number | null
}

export type CanvasBuffer = readonly (readonly CanvasCell[])[]

export type CanvasWidget = {
  readonly type: "canvas"
  readonly buffer: CanvasBuffer
  readonly width: number
  readonly height: number
}

export type Widget =
  | TextWidget
  | RowWidget
  | ColWidget
  | GridWidget
  | CanvasWidget
