# Sabai Sudoku

**Play interactive Sudoku puzzles directly in Claude with a visual game board.**

| Field | Value |
|-------|-------|
| Type | MCP App |
| Version | 1.0.0 |
| Status | Active |
| Repo | `plugins/sabai-sudoku` |

---

## Overview

An interactive Sudoku puzzle game running directly within Claude as an MCP App. Features a visual 9x9 game board with real-time gameplay, multiple difficulty levels, and game assistance tools.

## Key Features

- Visual 9x9 Sudoku grid rendered as an MCP App
- Four difficulty levels: Easy, Medium, Hard, Expert
- Keyboard input (1-9) or clickable number pad
- Hint system for next moves
- Error checking
- Move tracking and remaining cells counter

## Use Cases

- "Let's play Sudoku"
- "Start a new Sudoku game on hard difficulty"
- "I want to play an easy Sudoku puzzle"

## MCP Tools

- `play_sudoku` - Start a new game or resume an existing one
- `sudoku_move` - Place a number on the board (UI-only)
- `sudoku_hint` - Get a hint for the next move (UI-only)
- `sudoku_check` - Check board for errors (UI-only)

## Configuration

No configuration required. The plugin works out of the box.

## Authentication

None required.

## Dependencies

- **Required**: None (self-contained MCP App)

## Limitations

- Game state resets when Claude session ends
- Single player only

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-sudoku)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-sudoku/CHANGELOG.md)
