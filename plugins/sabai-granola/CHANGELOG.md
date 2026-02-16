# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-17

### Added
- Startup script that automatically triggers OAuth flow on first load
- No manual `/connect` needed - browser opens automatically if not authenticated

### Changed
- Use bash startup script instead of direct npx command

## [1.1.0] - 2026-02-17

### Added
- `/connect` command to trigger OAuth authentication flow

### Fixed
- Use mcp-remote to properly connect to Granola's HTTP MCP endpoint
- Granola requires OAuth authentication via browser on first use

## [1.0.0] - 2026-02-16

### Added
- Initial release
