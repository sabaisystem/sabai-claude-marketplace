# Sabai Remotion

**Create videos programmatically with Remotion**

| Field | Value |
|-------|-------|
| Type | MCP App + Tools |
| Version | 0.1.0 |
| Status | In Progress |
| Command | `/video` |
| Repo | `plugins/sabai-remotion` |

---

## Overview

A comprehensive plugin for creating videos programmatically using Remotion. Provides an interactive MCP App UI for previewing and composing videos, plus MCP tools for rendering videos from templates with dynamic data.

## Key Features

- Interactive video preview UI (MCP App)
- Template-based video generation
- Data-driven visualizations and animations
- Multi-format export (MP4, WebM, GIF)
- Social media presets (TikTok, Instagram, Twitter)

## Use Cases

- "Create a tutorial video showing how to use this feature"
- "Generate a social clip from this data"
- "Render an animated chart from my sales numbers"
- "Preview my video composition at frame 30"

## MCP Tools

- `list_templates` - List available video templates with metadata
- `preview_frame` - Generate a single frame preview (fast)
- `render_video` - Render full video to file
- `get_composition_info` - Get metadata about a composition

## Commands

- `/video` - Quick video generation from natural language

## Configuration

### System Requirements

- Node.js 18+
- Chromium (bundled with Remotion)
- FFmpeg (bundled with Remotion 4.x)

### MCP Server

The plugin runs an MCP server that manages Remotion rendering. No additional configuration required.

## Authentication

None required.

## Permissions

Required Claude Code permissions:
- `Bash(command:*)` - Running the MCP server

## Dependencies

- **Required**: Node.js 18+
- **Bundled**: Chromium, FFmpeg (via Remotion)

## Limitations

- Video rendering can take time depending on duration and complexity
- Large videos require significant disk space
- First render may be slow due to Remotion bundle compilation

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-remotion)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-remotion/CHANGELOG.md)
