# Sabai Harvest

**Efficient time tracking with Harvest CLI for employees and contractors.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands |
| Version | 1.5.0 |
| Status | Active |
| Updated | 2026-02-20 |
| Command | `/setup-harvest`, `/duplicate-week`, `/log`, `/timesheet`, `/team-timesheet`, `/approve`, `/project-budget`, `/team-report`, `/remind` |
| Repo | `plugins/sabai-harvest` |

---

## Overview

An efficient Harvest time tracking plugin using the [hrvst-cli](https://github.com/kgajera/hrvst-cli). Supports duplicating last week's timesheet with review before submitting, quick time logging with aliases, weekly timesheet review with gap detection, auto-install of Harvest CLI, and natural language time entry.

## Key Features

- Duplicate last week's timesheet with review before submitting
- Quick time logging with aliases
- Weekly timesheet review and gap detection
- Auto-install of Harvest CLI
- Natural language time entry
- **User roles support** (Employee vs Manager) with automatic detection
- **Manager dashboard** for team timesheets, approvals, and project budgets
- **Approval workflow** for timesheet review and feedback
- **Team reporting** with utilization and project distribution

## Use Cases

### For Employees
- "Duplicate last week's timesheet"
- "Log 2 hours to client-dev project"
- "Show me my timesheet for this week"
- "Review my time entries for gaps"

### For Managers
- "Show me the team's timesheets for last week"
- "Approve Alice's timesheet"
- "What's the budget status for Project X?"
- "Send a reminder to Bob about his incomplete timesheet"
- "Generate a team report for February"

## Commands

### Employee Commands
- `/setup-harvest` - Install CLI, authenticate, and create aliases
- `/duplicate-week` - Copy last week's entries with review before submitting
- `/log [hours] [project]` - Quick time entry
- `/timesheet [day|week]` - View your timesheet

### Manager Commands
- `/team-timesheet [week] [member]` - View team member timesheets
- `/approve [member] [week]` - Approve or reject timesheets
- `/project-budget [project]` - View project financial data
- `/team-report [period]` - Generate comprehensive team reports
- `/remind [member]` - Send reminders for incomplete timesheets

## Configuration

### CLI Commands Reference

| Action | Command |
|--------|---------|
| Install CLI | `npm install -g hrvst-cli` |
| Login | `hrvst login` |
| Start timer | `hrvst start [alias]` |
| Stop timer | `hrvst stop` |
| Log hours | `hrvst log <hours> [alias]` |
| Add notes | `hrvst note "description"` |
| List aliases | `hrvst alias list` |
| Create alias | `hrvst alias create <name>` |

## Authentication

Harvest account required. Run `/setup-harvest` to authenticate via `hrvst login`.

## Dependencies

- **Required**: Node.js v14+, Harvest account

## Limitations

- Requires hrvst-cli to be installed globally
- Works only with Harvest time tracking (not other providers)

## Tips

1. **Create aliases** for all your regular projects
2. **Review weekly** to catch any gaps
3. **Log immediately** rather than waiting until end of week

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-harvest)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-harvest/CHANGELOG.md)
- [Harvest CLI Documentation](https://kgajera.github.io/hrvst-cli/)
- [Harvest](https://www.getharvest.com/)
