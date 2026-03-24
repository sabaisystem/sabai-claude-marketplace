# Sabai Diagrams

**Mermaid diagram generator with visual renderer for flowcharts, sequences, state diagrams, and Gantt charts.**

| Field | Value |
|-------|-------|
| Type | MCP App + Skills + Commands |
| Version | 1.0.0 |
| Status | Active |
| Command | `/diagram` |
| Repo | `plugins/sabai-diagrams` |

---

## Overview

Generate Mermaid diagrams from natural language and render them visually in a side panel. Supports Notion-style display modes (diagram only, code only, or both), with optional FigJam export via the Figma MCP. Claude auto-detects the best diagram type from your description.

## Key Features

- Visual Mermaid renderer in an MCP App side panel
- Three display modes: diagram, code, or both (Notion-style toggle)
- Auto-detect diagram type from natural language
- Six diagram types: flowchart, sequence, state, Gantt, ER, class
- Copy Mermaid code to clipboard
- Iterative refinement (add nodes, change layout, restyle)
- FigJam export for flowchart, sequence, state, and Gantt diagrams
- Light and dark mode support
- Guardrails: recommends better alternatives for pie/mindmap/timeline

## Use Cases

- "Show me our deployment pipeline"
- "Create a sequence diagram for the checkout flow"
- "Map the ticket lifecycle from triage to done"
- "Plan the Q2 project timeline as a Gantt chart"
- "Show the data model for our blog"

## MCP Tools

- `render_diagram` - Render Mermaid code in the visual panel

## Commands

- `/diagram [description]` - Auto-detect type and generate
- `/diagram flowchart [description]` - Generate a flowchart
- `/diagram sequence [description]` - Generate a sequence diagram
- `/diagram state [description]` - Generate a state diagram
- `/diagram gantt [description]` - Generate a Gantt chart
- `/diagram er [description]` - Generate an ER diagram
- `/diagram class [description]` - Generate a class diagram
- `/diagram export` - Export to FigJam (requires Figma MCP)
- `/diagram types` - List available diagram types

## Diagram Types

| Type | Best For | FigJam Export |
|------|----------|---------------|
| Flowchart | Processes, pipelines, decision trees | Yes |
| Sequence | API flows, service interactions | Yes |
| State | Lifecycles, status machines | Yes |
| Gantt | Project timelines, sprint plans | Yes |
| ER | Data models, schemas | No |
| Class | Architecture, OOP design | No |

## Authentication

None required.

## Dependencies

- **Required**: Node.js 18+, npm
- **Optional**: Figma MCP for FigJam export

## Limitations

- Complex diagrams (30+ nodes) may be hard to read in the side panel
- Pie charts, mindmaps, and timeline diagrams are intentionally excluded (better alternatives exist)
- FigJam export only supports flowchart, sequence, state, and Gantt
- ER and Class diagrams are engineering-focused

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-diagrams)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-diagrams/CHANGELOG.md)
