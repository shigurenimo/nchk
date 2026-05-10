# open-tui

A declarative TUI library designed for AI-human collaborative development.

## Design Philosophy

### Part 1: AI-Friendly Code Design

LLM-based code generation faces recurring problems:

- API misuse due to complex interfaces
- Forgetting constraints mentioned in earlier prompts
- Implicit state dependencies causing subtle bugs
- Difficulty recovering from errors without clear feedback

**Prompts are not enough.** Constraints must be expressed in code, with immediate feedback through type errors or runtime errors. This allows AI to self-correct.

#### Minimal API Surface

```typescript
text("Hello")           // Text
row(child1, child2)     // Horizontal layout
col(child1, child2)     // Vertical layout
```

Only 3 widget types. Fewer choices lead to fewer mistakes. No need to decide between "div vs span vs section".

#### Tokenized Values

```typescript
type Justify = "start" | "center" | "end" | "space-between"
type Items = "start" | "center" | "end"
```

- String literal types align with LLM token prediction
- `"center"` is learned as a single token with high generation accuracy
- Discrete keywords cause fewer errors than arbitrary numbers (`x: 42`)

#### Familiar Vocabulary (Tailwind CSS)

```typescript
col({ justify: "space-between", items: "center" }, ...)
```

- `justify` and `items` are Tailwind CSS / Flexbox vocabulary
- Reuses concepts abundant in LLM training data
- Zero cognitive load to learn a new API

#### Type and Runtime Constraints

```typescript
// Type error: number not assignable to string
text(123)

// Runtime error: multi-byte characters prohibited
text("こんにちは")  // Error: Invalid ASCII string
```

- Prompt instructions are forgotten in long conversations
- Type errors provide immediate, specific feedback
- AI can read error messages and self-correct

#### No Implicit State

```typescript
// BAD: Depends on global state
setColor("red")
drawText("Hello")

// GOOD: All information in arguments
text({ fg: [255, 0, 0] }, "Hello")
```

- Declarative API fully expresses "what to render"
- AI can write correct code from function signatures alone

### Part 2: TUI-Specific Problems

Building terminal UIs has unique challenges that compound AI errors:

#### Character Width Calculation

Terminal character width is complex: full-width, half-width, emoji, combining characters.

**Solution: ASCII-only**

```typescript
text("Hello")       // OK
text("こんにちは")   // Runtime Error
```

By limiting to ASCII, `str.length === display width` is guaranteed. No room for AI to miscalculate.

#### Coordinate Calculation

Off-by-one errors in manual coordinate calculations are common.

**Solution: Declarative Layout**

```typescript
col(
  { justify: "space-between", height: 24 },
  text("Top"),
  text("Bottom"),
)
```

No manual `x, y` calculations. The layout engine handles positioning.

#### Overflow and Clipping

Content exceeding boundaries breaks the display.

**Solution: Constraint Propagation**

```typescript
col({ width: 15 }, text("This text is too long"))
// Renders: "This text is t"
```

Children automatically respect parent constraints. Even if AI makes mistakes, the screen doesn't break.

## Summary

| Problem | Solution |
|---------|----------|
| API misuse | Minimal API, type constraints |
| Forgotten prompts | Type + runtime enforcement |
| Implicit state | Pure functions, explicit arguments |
| Character width | ASCII-only with runtime validation |
| Coordinate errors | Declarative layout, auto-positioning |
| Overflow | Constraint propagation, auto-truncation |

## Features

- **3 widget types only**: `text`, `row`, `col`
- **ASCII-only**: Multi-byte characters prohibited at type and runtime level
- **Tailwind-style alignment**: `justify` (main axis), `items` (cross axis)
- **Overflow prevention**: Constraint propagation with automatic truncation
- **Immutable**: All widgets are frozen objects

## API

### text(style?, content)

```typescript
text("Hello")
text({ px: 1, fg: [255, 255, 255], bg: [0, 0, 0] }, "Styled")
```

Options: `px`, `pl`, `pr`, `fg`, `bg`

### row(options?, ...children)

```typescript
row({ justify: "space-between", items: "center", width: 80, gap: 2 },
  text("Left"),
  text("Right"),
)
```

Options: `justify`, `items`, `width`, `gap`, `bg`

### col(options?, ...children)

```typescript
col({ justify: "center", items: "center", width: 80, height: 24 },
  text("Centered"),
)
```

Options: `justify`, `items`, `width`, `height`, `gap`, `bg`

### render(widget, x, y, maxWidth, maxHeight)

```typescript
const output = render(widget, 0, 0, 80, 24)
process.stdout.write(output)
```

## Example

```typescript
import { text, row, col, render } from "@/ui"

const sidebar = col(
  { width: 20, bg: [50, 50, 65], items: "end" },
  text({ px: 1, bg: [255, 130, 130] }, "00"),
  text({ px: 1 }, "01"),
)

const main = col({ width: 60 }, text("Main Content"))

const screen = row(main, sidebar)

process.stdout.write(render(screen, 0, 0, 80, 24))
```

## File Structure

```
src/open-tui/
  types.ts          - Type definitions
  ascii.ts          - ASCII string validation
  text.ts           - text() widget constructor
  row.ts            - row() widget constructor
  col.ts            - col() widget constructor
  is-options.ts     - Options type guard
  measure-width.ts  - Width calculation
  measure-height.ts - Height calculation
  ansi.ts           - ANSI escape helpers
  render-widget.ts  - Internal recursive renderer
  render.ts         - Public render function
  index.ts          - Library exports
```
