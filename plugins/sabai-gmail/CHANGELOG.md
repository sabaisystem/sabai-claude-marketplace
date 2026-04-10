# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-04-02

### Changed
- Migrated skills from flat file format to directory format (`skills/<name>/SKILL.md`) for Claude Code marketplace compatibility
- Added YAML frontmatter with name and description to all skill files
- Added explicit skills and commands path declarations in plugin.json

## [1.3.0] - 2026-02-21

### Added
- MCP App email editor with embedded UI in Claude
- Email composition form with To, CC, BCC, Subject, and Body fields
- Email chip component for managing multiple recipients
- Draft management (save to Gmail drafts, discard)
- Reply indicator for threaded conversations
- Dark mode support
- Sabai System branding footer

### Changed
- Combined Gmail API tools and MCP App editor into single MCP server
- Unified architecture: one MCP provides both Gmail operations and email editor UI

## [1.2.0] - 2026-02-21

### Added
- Email selection interface (`email-selection.md` skill)
- Numbered card view for email selection with urgency indicators
- Natural language selection ("the one from Sarah", "the budget email")
- Sorting options: by urgency, date, sender, subject
- Filtering options: by urgency level, sender, keywords
- Dismissal support to remove emails from list
- Pagination for large result sets (10+ emails)
- `--sort` flag to `/followup` command

### Changed
- `/followup` command now shows interactive selection interface
- Enhanced selection flow with confirm-before-proceed

## [1.1.0] - 2026-02-21

### Changed
- Replaced external npm MCP servers with custom Gmail MCP server
- Dependencies now install automatically at plugin load via startup.sh

### Added
- Custom MCP server with 15 Gmail tools:
  - gmail_search, gmail_get_message, gmail_list_inbox
  - gmail_send_email, gmail_create_draft, gmail_reply
  - gmail_list_labels, gmail_add_labels, gmail_remove_labels
  - gmail_archive, gmail_trash
  - gmail_mark_read, gmail_mark_unread, gmail_star, gmail_unstar
- OAuth authentication script (npm run auth)

### Removed
- External @anthropic/gmail-mcp dependency
- External @anthropic/google-calendar-mcp dependency

## [1.0.0] - 2026-02-16

### Added
- Initial release
