/**
 * Helper to convert runtime Buffer to CanvasWidget
 */

import { canvas } from "@/ui/canvas"
import type { CanvasBuffer, CanvasWidget } from "@/ui/types"

export type RuntimeBuffer = readonly (readonly {
  readonly char: string
  readonly fg: number
  readonly bg: number | null
}[])[]

export function fromRuntimeBuffer(
  buffer: RuntimeBuffer,
  width: number,
  height: number,
): CanvasWidget {
  return canvas({
    buffer: buffer as CanvasBuffer,
    width,
    height,
  })
}
