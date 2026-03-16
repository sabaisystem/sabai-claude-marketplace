# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.1] - 2026-03-16

### Fixed
- `resolveIssueId` now uses exact filter matching (team key + issue number) instead of fuzzy `issueSearch` to prevent mismatches (e.g., SCM-1 matching SCM-10)
- Date filters (`completedAfter`, `createdAfter`, `updatedAfter`) now have client-side fallback filtering in `linear_search_issues` and `linear_list_issues`
- Team filter now has client-side fallback filtering to catch cases where the API ignores the `teamId` filter

### Added
- `withRetry` wrapper for transient API failures (fetch failed, ECONNRESET, ETIMEDOUT, 429, 503) with exponential backoff
- Cursor-based pagination support (`after` parameter and `pageInfo` in response) for `linear_search_issues` and `linear_list_issues`
- Input validation for RICE framework scores (Reach >= 0, Impact in [0.25, 0.5, 1, 2, 3], Confidence 0-100, Effort > 0) in `/prioritize`
- Input validation for ICE framework scores (Impact, Confidence, Ease must be 1-10) in `/prioritize`
- Flexible date format parsing in `/release-notes` (supports `Mar-1`, `March 1`, `3/1`, ISO format)
- Error handling for unmatched team/project names in `/roadmap` with available options list

## [1.5.0] - 2026-03-16

### Changed
- Rewrote `/dependencies` command with step-by-step MCP tool instructions
- Dual mode: ticket-level 2-depth graph traversal and project-wide dependency map
- Detects circular dependencies, critical paths, bottlenecks, and orphaned issues
- Rewrote `/refine` command with step-by-step MCP tool instructions
- Dual mode: single-ticket deep analysis and backlog-wide refinement readiness scoring
- Interactive flow for applying suggested improvements (AC, estimate, labels, priority)
- Compares against completed tickets for estimation guidance

## [1.4.0] - 2026-03-16

### Changed
- Rewrote `/decision` command with full step-by-step MCP tool instructions
- Conversational flow guides users through context, options, decision, and consequences
- ADRs stored as Linear issues with `Decision` label and `ADR-NNN:` title prefix
- Sequential numbering determined by searching existing ADR issues
- Machine-readable `<!-- adr-metadata -->` block in issue descriptions
- Bidirectional linking between ADR issues and related tickets
- Updated `decision-log.md` skill to align with new Linear storage approach

## [1.3.0] - 2026-03-16

### Changed
- Rewrote `/risk` command with step-by-step MCP tool instructions
- Simplified from 4 framework options to focused Impact x Likelihood analysis
- Added real-time risk detection from Linear data (estimates, staleness, assignment, keywords)
- Added project-level risk indicators (overdue, low progress, concentration risk)
- Added dual mode: project-wide assessment and single-ticket deep analysis
- Added optional tracking issue creation for Critical/High risks

## [1.2.0] - 2026-03-16

### Added
- `linear_get_project_milestones` MCP tool for fetching project milestones (name, targetDate, status, progress)
- `completedAt` and `startedAt` fields to `linear_get_project` response

### Changed
- Rewrote `/roadmap` command with full step-by-step MCP tool instructions
- Timeline-by-month view with status indicators, milestones, and risk identification
- Supports timeframe parsing: `q1`-`q4`, `h1`-`h2`, year, `next-3-months`

### Fixed
- Use valid `eq` comparator for `stateName` and `labelName` filters (was `eqCaseInsensitive`)

## [1.1.1] - 2026-03-16

### Changed
- Rewrote `/release-notes` command with full step-by-step MCP tool instructions
- Added 3-tier "since" date resolution (explicit date, previous version tag, git tag fallback)
- Added `--project` flag for project-scoped release notes
- Added client-side label categorization, feature grouping, and user-friendly description guidance

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
