/**
 * Custom error classes for open-tui
 */

export class HasciiUiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "HasciiUiError"
  }
}

export class HasciiUiInvalidAsciiError extends HasciiUiError {
  readonly invalidChars: string

  constructor(invalidChars: string) {
    super(`Invalid ASCII string: contains "${invalidChars}"`)
    this.name = "HasciiUiInvalidAsciiError"
    this.invalidChars = invalidChars
    Object.freeze(this)
  }
}

export class HasciiUiInvalidColorError extends HasciiUiError {
  readonly input: unknown

  constructor(input: unknown) {
    super(`Invalid color: ${JSON.stringify(input)}`)
    this.name = "HasciiUiInvalidColorError"
    this.input = input
    Object.freeze(this)
  }
}

export class HasciiUiOverflowError extends HasciiUiError {
  readonly content: string
  readonly maxWidth: number
  readonly actualWidth: number

  constructor(content: string, maxWidth: number, actualWidth: number) {
    super(
      `Content overflow: "${content}" requires ${actualWidth} chars but only ${maxWidth} available`,
    )
    this.name = "HasciiUiOverflowError"
    this.content = content
    this.maxWidth = maxWidth
    this.actualWidth = actualWidth
    Object.freeze(this)
  }
}
