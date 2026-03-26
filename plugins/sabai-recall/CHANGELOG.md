# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-02-16

### Added
- Calendar V2 integration for automatic meeting detection
- `/join` without arguments now joins current/next calendar meeting
- `recall_list_calendars` tool to list connected calendars
- `recall_list_calendar_events` tool to list upcoming meetings
- `recall_get_current_meeting` tool to find current or next meeting
- `recall_schedule_bot_for_event` tool to schedule bots for calendar events

## [1.3.0] - 2026-02-16

### Added
- `/recording` command now accepts meeting URLs in addition to bot IDs
- `recall_find_bot_by_meeting` tool to find bots by meeting URL
- `recall_watch_recording` now supports `meeting_url` parameter

## [1.2.0] - 2026-02-16

### Added
- Embedded video player for watching recordings directly in Claude
- `recall_watch_recording` tool with MCP App integration
- `/recording` command to watch recordings in embedded player

## [1.1.0] - 2026-02-16

### Added
- `/join` command for quickly sending a bot to join a meeting
- `/transcript` command for getting meeting transcripts

## [1.0.0] - 2026-02-16

### Added
- Initial release of sabai-recall plugin
- `recall_create_bot` tool to create meeting bots
- `recall_get_bot` tool to get bot status and details
- `recall_list_bots` tool to list all bots
- `recall_delete_bot` tool to remove bots
- `recall_get_recording` tool to get recording URLs
- `recall_get_transcript` tool to get meeting transcripts
- `recall_get_participants` tool to get participant list
- `recall_leave_meeting` tool to make bot leave meeting
- Support for scheduling bots in advance
- Support for Zoom, Google Meet, Teams, and other platforms
