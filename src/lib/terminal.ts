// Terminal utilities for interactive UI (zero dependencies)

import * as readline from "node:readline"

export type Key = {
  name: string
  ctrl: boolean
  shift: boolean
  sequence?: string
}

export function enableRawMode(): void {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
  }
  process.stdin.resume()
  readline.emitKeypressEvents(process.stdin)
}

export function disableRawMode(): void {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false)
  }
}

export function onKeypress(callback: (key: Key) => void): void {
  process.stdin.on("keypress", (str, key) => {
    if (!key) return
    callback({
      name: key.name ?? "",
      ctrl: key.ctrl ?? false,
      shift: key.shift ?? false,
      sequence: str ?? key.sequence,
    })
  })
}

export function clearScreen(): void {
  process.stdout.write("\x1b[2J\x1b[H")
}

export function moveCursor(row: number, col: number): void {
  process.stdout.write(`\x1b[${row};${col}H`)
}

export function hideCursor(): void {
  process.stdout.write("\x1b[?25l")
}

export function showCursor(): void {
  process.stdout.write("\x1b[?25h")
}

export function clearLine(): void {
  process.stdout.write("\x1b[2K")
}

export function prompt(message: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}
