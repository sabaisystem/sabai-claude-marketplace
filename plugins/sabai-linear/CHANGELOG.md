# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-06

### Changed
- Replaced OAuth (`mcp-remote` + `https://mcp.linear.app/mcp`) with token-based auth (`LINEAR_API_KEY`)
- Built custom MCP server using `@linear/sdk` for CoWork and CLI compatibility
- No browser popup required — works in sandboxed environments

### Added
- Custom MCP server with 11 tools: create, get, search, list, update issues; get/list teams; list/get/update projects; get cycles
- Bundled server (`dist/server.cjs`) for CoWork deployment
- `startup.sh` with env loading and validation

## [1.0.0] - 2026-02-16

### Added
- Initial release
