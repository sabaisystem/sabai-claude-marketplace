# Sabai Tella

**Video management and content planning with Tella for async video communication.**

| Field | Value |
|-------|-------|
| Type | MCP + Commands |
| Version | 1.1.0 |
| Status | Active |
| Command | `/tella` |
| Repo | `plugins/sabai-tella` |

---

## Overview

A plugin for managing Tella videos and playlists, planning video content, and creating scripts for async video communication. Supports listing, updating, duplicating, and organizing videos, playlist management with custom settings, structured content planning with talking points, script generation, and clip extraction with trimming.

## Key Features

- List, update, duplicate, and organize Tella videos
- Create and manage playlists with custom settings
- Structure video content with clear talking points
- Generate scripts and outlines for recordings
- Extract clips from existing videos with trimming

## Use Cases

- "List my recent Tella videos"
- "Create a 30-second clip from my webinar starting at 5 minutes"
- "Create a new playlist called 'Product Tutorials'"
- "Help me prepare a weekly team update video"

## Commands

- `/tella` - Plan and prepare Tella video content

## MCP Tools

### Video Management
- `list_videos` - Retrieve workspace videos with pagination and playlist filtering
- `get_video` - Fetch video details with transcript, chapters, thumbnails
- `update_video` - Modify metadata, playback settings, captions, access levels
- `delete_video` - Move videos to trash
- `duplicate_video` - Copy videos with optional trimming or chapter extraction

### Playlist Operations
- `list_playlists` - Browse playlists filtered by visibility type
- `create_playlist` - Generate new playlists with customizable emoji and access controls
- `get_playlist` - Access detailed playlist information
- `update_playlist` - Edit metadata and security settings
- `delete_playlist` - Remove playlists
- `add_video_to_playlist` / `remove_video_from_playlist` - Manage playlist contents

## Configuration

### MCP Server Setup (Claude Code)

```bash
claude mcp add --transport http --scope user tella https://api.tella.com/mcp
```

### MCP Server Setup (Claude Desktop)

```json
{
  "mcpServers": {
    "tella": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://api.tella.com/mcp"]
    }
  }
}
```

## Authentication

OAuth 2.1 via Tella. On first use, you'll be prompted to authenticate with your Tella account.

**Troubleshooting**: If you have authentication issues, clear the MCP auth cache:
```bash
rm -rf ~/.mcp-auth
```

## Dependencies

- **Required**: Tella account

## Limitations

- Requires Tella subscription
- Video editing features depend on Tella plan

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-tella)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-tella/CHANGELOG.md)
- [Tella](https://tella.tv)
- [Tella MCP Documentation](https://docs.tella.com/mcp-server)
