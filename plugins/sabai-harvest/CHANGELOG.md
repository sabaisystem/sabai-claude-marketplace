# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-02-20

### Added
- User roles support (Employee vs Manager) with automatic detection from Harvest API
- `/team-timesheet` command for managers to view team member timesheets
- `/approve` command for timesheet approval/rejection workflow
- `/project-budget` command for viewing project financial data
- `/team-report` command for generating comprehensive team reports
- `/remind` command for sending reminders to team members with incomplete timesheets
- Role-based access control with graceful error handling
- Team timesheet grid view with status indicators
- Project budget dashboard with burn rate and runway calculations
- Privacy-aware data access respecting Harvest permissions

## [1.0.0] - 2026-02-16

### Added
- Initial release
