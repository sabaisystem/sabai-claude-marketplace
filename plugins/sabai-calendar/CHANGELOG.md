# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-04-02

### Changed
- Migrated skills from flat file format to directory format (`skills/<name>/SKILL.md`) for Claude Code marketplace compatibility
- Added YAML frontmatter with name and description to all skill files
- Added explicit skills and commands path declarations in plugin.json

## [1.2.0] - 2026-02-21

### Added
- Custom MCP server with Google Calendar integration
- 10 calendar tools: list_events, today, week, get_event, create_event, update_event, delete_event, free_busy, list_calendars, quick_add
- OAuth authentication flow with browser-based authorization
- Auto npm install via startup.sh on plugin load
- Comprehensive setup instructions in README

### Changed
- Replaced external npm package with custom MCP server
- Plugin now requires users to bring their own Google OAuth credentials

## [1.1.0] - 2026-02-20

### Added
- Documentation for Google Calendar MCP connection options
- Comparison of Claude built-in integration vs MCP server approach
- Guide for using multiple Google accounts on different devices
- Re-authentication instructions

## [1.0.0] - 2026-02-16

### Added
- Initial release
