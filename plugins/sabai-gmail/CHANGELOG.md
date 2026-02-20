# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
