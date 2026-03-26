# Changelog

## [1.1.0] - 2026-03-24

### Added
- SVG and PNG export via `export_diagram` tool and UI buttons
- PNG export supports configurable scale (1-4x) and background (transparent, white, dark)
- SVG export preserves diagram styling with optional background
- Export buttons in toolbar for direct download from the MCP App

## [1.0.0] - 2026-03-24

### Added
- MCP App with visual Mermaid diagram renderer
- Three display modes: diagram only, code only, both (Notion-style toggle)
- Diagram Creator skill with auto-detection of diagram type from natural language
- Flowchart reference with examples for pipelines, decision trees, and user journeys
- Sequence diagram reference with examples for API flows and checkout processes
- State diagram reference with examples for ticket lifecycles and order statuses
- Gantt chart reference with examples for sprint plans and migration roadmaps
- Technical diagrams reference (ER + Class) for engineering use cases
- `/diagram` command with type routing, auto-detection, and FigJam export
- Copy to clipboard functionality
- Light and dark mode support
- Sabai System branding
- Guardrails against poor-UX diagram types (pie, mindmap, timeline)
