# Sabai Mermaid

**Interactive Mermaid diagram editor with conversational updates - create, visualize, and iterate on diagrams through chat.**

| Field | Value |
|-------|-------|
| Type | MCP App |
| Version | 1.0.0 |
| Status | Active |
| Repo | `plugins/sabai-mermaid` |

---

## Overview

An interactive Mermaid diagram plugin that allows users to create diagrams through conversation with Claude, visualize them in a live preview interface, and iteratively refine them through natural language discussion. Supports all Mermaid diagram types including flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, and more.

## Key Features

- Generate Mermaid diagrams from natural language descriptions
- Live preview of diagrams in MCP App interface
- Conversational updates - discuss changes and see them reflected
- Support for all Mermaid diagram types (flowchart, sequence, class, state, ER, pie, etc.)
- Built-in templates for quick starts
- Undo support for reverting changes
- Light and dark mode support
- Copy diagram code to clipboard

## Use Cases

- "Create a flowchart showing our user signup process"
- "Make a sequence diagram of the API authentication flow"
- "Add an error handling branch to the diagram"
- "Change this to a class diagram showing inheritance"
- "Create an ER diagram for our database schema"

## MCP Tools

- `render_mermaid` - Render Mermaid code and display in the UI
- `update_diagram` - Update the current diagram with new code (UI-only)
- `undo_diagram` - Undo the last change (UI-only)
- `get_diagram` - Get the current diagram code (UI-only)
- `new_diagram` - Start fresh with a new diagram (UI-only)

## Supported Diagram Types

- **Flowchart** - Process flows and decision trees
- **Sequence Diagram** - Interactions between components
- **Class Diagram** - Object-oriented structures
- **State Diagram** - State machines and transitions
- **ER Diagram** - Database entity relationships
- **Pie Chart** - Data distributions
- **Gantt Chart** - Project timelines
- **Mind Map** - Hierarchical idea organization
- And more...

## Configuration

No configuration required. The plugin works out of the box.

## Authentication

None required.

## Dependencies

- **Required**: None (Mermaid.js is loaded from CDN)

## Limitations

- Diagram state resets when Claude session ends
- Very complex diagrams may have rendering performance issues
- Some advanced Mermaid features may not be supported

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-mermaid)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-mermaid/CHANGELOG.md)
- [Mermaid Documentation](https://mermaid.js.org/)
