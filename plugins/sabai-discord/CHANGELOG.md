# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-04-02

### Changed
- Migrated skills from flat file format to directory format (`skills/<name>/SKILL.md`) for Claude Code marketplace compatibility
- Added YAML frontmatter with name and description to all skill files
- Added explicit skills and commands path declarations in plugin.json

## [1.5.0] - 2026-03-06

### Removed
- 5 forum tools (`discord_get_forum_channels`, `discord_create_forum_post`, `discord_get_forum_post`, `discord_reply_to_forum`, `discord_delete_forum_post`) — server has no forum channels
- 4 webhook tools (`discord_create_webhook`, `discord_send_webhook_message`, `discord_edit_webhook`, `discord_delete_webhook`) — unused
- `/discord-roles` command — no backing MCP tools for role management
- `/discord-role-assign` command — no backing MCP tools for role assignment
- Forum and webhook sections from server-management skill

## [1.4.0] - 2026-03-06

### Added
- `discord_edit_message` tool — edit bot messages in channels and DMs
- Rebuilt `dist/server.cjs` bundle for Claude for Work compatibility

## [1.3.0] - 2026-03-06

### Added
- `discord_search_members` tool — search guild members by username or display name
- `discord_send_dm` tool — send direct messages to users by ID
- `discord_read_dm` tool — read DM conversation history with a user

### Fixed
- Commands (`discord-dm`, `discord-user`, `discord-role-assign`) now reference real MCP tools instead of nonexistent `get_user_id_by_name`

## [1.2.0] - 2026-03-05

### Changed
- Replaced WebSocket-based `mcp-discord` with custom REST-only MCP server for Cowork compatibility
- All 21 tools now use `@discordjs/rest` direct HTTP calls instead of discord.js gateway
- Bundle size reduced from 2.3MB to ~940KB
- Startup no longer requires persistent WebSocket connection

### Removed
- `discord_login` tool (token is now validated automatically on startup)
- `discord.js` dependency (replaced with `@discordjs/rest` + `discord-api-types`)

## [1.1.0] - 2026-03-05

### Added
- Bundled MCP server for Claude for Work (Cowork) compatibility
- `mcp/` directory with startup.sh, package.json, and pre-built dist/server.mjs
- Config directory for .env-based token setup

### Changed
- MCP server now uses local bundled `mcp-discord` instead of `npx discord-mcp@latest`
- Plugin type updated to MCP + Skills + Commands

## [1.0.0] - 2026-02-16

### Added
- Initial release
