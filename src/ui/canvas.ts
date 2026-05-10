/**
 * Create a canvas widget from a buffer
 */

import type { CanvasBuffer, CanvasWidget } from "@/ui/types"

export type CanvasOptions = {
  readonly buffer: CanvasBuffer
  readonly width: number
  readonly height: number
}

export function canvas(options: CanvasOptions): CanvasWidget {
  return Object.freeze({
    type: "canvas",
    buffer: options.buffer,
    width: options.width,
    height: options.height,
  })
}
